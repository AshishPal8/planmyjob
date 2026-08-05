import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../../db";
import { jobs } from "../../db/schema/job.schema";
import { savedJobs, jobApplications } from "../../db/schema";
import type { NormalizedJob } from "../scraper/scraper.schema";
import { generateSlug } from "../../utils/generateSlug";
import type { GetJobsInput } from "./jobs.schema";

const validJobTypes = [
  "full_time",
  "part_time",
  "contract",
  "freelance",
  "internship",
  "remote",
] as const;

export const saveJobsService = async (
  incoming: NormalizedJob[],
): Promise<number> => {
  if (incoming.length === 0) return 0;

  const sourced = incoming.filter((j) => j.sourceId);
  const manual = incoming.filter((j) => !j.sourceId);

  let saved = 0;

  if (sourced.length > 0) {
    const values = sourced.map(toDbShape);

    console.dir(values, { depth: null });

    const result = await db
      .insert(jobs)
      .values(values)
      .onConflictDoNothing({ target: jobs.sourceId })
      .returning({ id: jobs.id });

    saved += result.length;
  }

  if (manual.length > 0) {
    const result = await db
      .insert(jobs)
      .values(manual.map(toDbShape))
      .returning({ id: jobs.id });

    saved += result.length;
  }

  return saved;
};

const toDbShape = (job: NormalizedJob) => ({
  title: job.title,
  slug: generateSlug(job.title, job.company),
  company: job.company,
  companyLogo: job.companyLogo ?? null,
  companyDomain: job.companyDomain ?? null,
  location: job.location ?? null,
  description: job.description ?? null,
  skills: Array.isArray(job.skills)
    ? job.skills.filter((s) => typeof s === "string")
    : [],
  salary: job.salary ?? null,
  jobType: validJobTypes.includes(job.jobType as any)
    ? job.jobType
    : "full_time",
  category: job.category ?? null,
  applyUrl: job.applyUrl ?? null,
  source: job.source,
  sourceId: job.sourceId ?? null,
  sourceUrl: job.sourceUrl ?? null,
  postedAt: job.postedAt ?? new Date(),
  isActive: true,
  isDeleted: false,
});

export const deactivateOldJobs = async (olderThanDays = 30): Promise<void> => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - olderThanDays);

  const result = await db
    .update(jobs)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(jobs.isActive, true))
    .returning({ id: jobs.id });

  if (result.length > 0) {
    console.log(
      `🗑️ Deactivated ${result.length} jobs older than ${olderThanDays} days`,
    );
  }
};

export const matchJobsToSkills = async (skills: string[], limit = 20) => {
  if (skills.length === 0) return [];

  const normalizedSkills = skills.map((s) => s.toLowerCase());

  const result = await db
    .select()
    .from(jobs)
    .where(
      sql`
        ${jobs.isActive} = true
        AND ${jobs.isDeleted} = false
        AND ${jobs.skills} && ${sql`ARRAY[${sql.join(
          normalizedSkills.map((s) => sql`${s}`),
          sql`, `,
        )}]::text[]`}
      `,
    )
    .limit(limit * 3);

  const scored = result.map((job) => {
    const jobSkills = (job.skills ?? []).map((s) => s.toLowerCase());
    const matches = normalizedSkills.filter((s) => jobSkills.includes(s));
    const matchScore = Math.round((matches.length / skills.length) * 100);
    return { ...job, matchScore };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
};

export const getJobsService = async (
  filters: GetJobsInput,
  userId?: number,
) => {
  const { title, skills, locations, jobType, page, pageSize } = filters;
  const offset = (page - 1) * pageSize;

  const normalizedSkills = [
    ...new Set(skills.map((s) => s.toLowerCase().trim()).filter(Boolean)),
  ];

  const titleWords = [
    ...new Set(
      (title ?? "")
        .toLowerCase()
        .split(/[\s,/\-()]+/)
        .map((w) => w.trim())
        .filter((w) => w.length > 2),
    ),
  ];

  const allTerms = [...new Set([...normalizedSkills, ...titleWords])];

  const conditions = [
    sql`${jobs.isActive}  = true`,
    sql`${jobs.isDeleted} = false`,
  ];

  if (jobType) {
    conditions.push(sql`${jobs.jobType} = ${jobType}::job_type`);
  }

  if (locations.length > 0) {
    conditions.push(
      sql`(${sql.join(
        locations.map((loc) => sql`${jobs.location} ILIKE ${`%${loc}%`}`),
        sql` OR `,
      )})`,
    );
  }

  if (allTerms.length > 0) {
    conditions.push(
      sql`(${sql.join(
        allTerms.map(
          (term) =>
            sql`(
              EXISTS (SELECT 1 FROM unnest(${jobs.skills}) AS s WHERE lower(s) = ${term})
              OR ${jobs.title}       ILIKE ${`%${term}%`}
              OR ${jobs.description} ILIKE ${`%${term}%`}
            )`,
        ),
        sql` OR `,
      )})`,
    );
  }

  // Join saved/applied status in the same round trip instead of querying for
  // it afterwards — with a remote DB, every extra round trip costs more than
  // the query itself for a table this size. -1 is a safe "no user" sentinel
  // since real user ids start at 1, so the join is a no-op when logged out.
  const effectiveUserId = userId ?? -1;

  const candidates = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      slug: jobs.slug,
      company: jobs.company,
      companyLogo: jobs.companyLogo,
      location: jobs.location,
      skills: jobs.skills,
      salary: jobs.salary,
      jobType: jobs.jobType,
      applyUrl: jobs.applyUrl,
      sourceUrl: jobs.sourceUrl,
      postedAt: jobs.postedAt,
      applyCount: jobs.applyCount,
      description: jobs.description,
      isSaved: sql<boolean>`${savedJobs.id} IS NOT NULL`,
      isApplied: sql<boolean>`${jobApplications.id} IS NOT NULL`,
    })
    .from(jobs)
    .leftJoin(
      savedJobs,
      and(eq(savedJobs.jobId, jobs.id), eq(savedJobs.userId, effectiveUserId)),
    )
    .leftJoin(
      jobApplications,
      and(
        eq(jobApplications.jobId, jobs.id),
        eq(jobApplications.userId, effectiveUserId),
      ),
    )
    .where(sql.join(conditions, sql` AND `))
    .limit(300);

  const normalize = (s: string) => s.replace(/[\s.\-_]/g, "").toLowerCase();

  const ranked = candidates
    .map(({ description, ...card }) => {
      const jobSkillsNorm = (card.skills ?? []).map(normalize);
      const jobTitleLower = (card.title ?? "").toLowerCase();
      const jobDescLower = (description ?? "").toLowerCase();

      let score = 0;
      let maxScore = 0;
      const matchedSkills: string[] = [];

      for (const skill of normalizedSkills) {
        maxScore += 10;
        const skillNorm = normalize(skill);

        if (jobSkillsNorm.includes(skillNorm)) {
          score += 10;
          matchedSkills.push(skill);
        } else if (
          jobSkillsNorm.some(
            (s) => s.includes(skillNorm) || skillNorm.includes(s),
          )
        ) {
          score += 7;
          matchedSkills.push(skill);
        } else if (jobTitleLower.includes(skill)) {
          score += 5;
        } else if (jobDescLower.includes(skill)) {
          score += 2;
        }
      }

      for (const word of titleWords) {
        maxScore += 4;
        if (jobTitleLower.includes(word)) score += 4;
        else if (jobDescLower.includes(word)) score += 1;
      }

      const matchScore =
        maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 0;

      return { ...card, matchedSkills, matchScore };
    })
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return (
        new Date(b.postedAt ?? 0).getTime() -
        new Date(a.postedAt ?? 0).getTime()
      );
    });

  const pageJobs = ranked.slice(offset, offset + pageSize);

  const enrichedJobs = pageJobs.map((job) => ({
    ...job,
    isSaved: job.isSaved ? 1 : 0,
    isApplied: job.isApplied ? 1 : 0,
  }));

  return { total: ranked.length, page, pageSize, jobs: enrichedJobs };
};

export const getJobSlugsForSitemapService = async () => {
  return db
    .select({ slug: jobs.slug, updatedAt: jobs.updatedAt })
    .from(jobs)
    .where(and(eq(jobs.isActive, true), eq(jobs.isDeleted, false)))
    .orderBy(sql`${jobs.updatedAt} desc`)
    .limit(50000);
};

export const getJobBySlugService = async (slug: string, userId?: number) => {
  // -1 is a safe "no user" sentinel since real user ids start at 1 — keeps
  // this a single round trip instead of the job query plus two more.
  const effectiveUserId = userId ?? -1;

  const rows = await db
    .select({
      job: jobs,
      isSaved: sql<boolean>`${savedJobs.id} IS NOT NULL`,
      isApplied: sql<boolean>`${jobApplications.id} IS NOT NULL`,
    })
    .from(jobs)
    .leftJoin(
      savedJobs,
      and(eq(savedJobs.jobId, jobs.id), eq(savedJobs.userId, effectiveUserId)),
    )
    .leftJoin(
      jobApplications,
      and(
        eq(jobApplications.jobId, jobs.id),
        eq(jobApplications.userId, effectiveUserId),
      ),
    )
    .where(
      and(
        eq(jobs.slug, slug),
        eq(jobs.isActive, true),
        eq(jobs.isDeleted, false),
      ),
    )
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  return {
    ...row.job,
    isSaved: row.isSaved ? 1 : 0,
    isApplied: row.isApplied ? 1 : 0,
  };
};

export const toggleSaveJobService = async (userId: number, jobId: number) => {
  const existing = await db
    .select({ id: savedJobs.id })
    .from(savedJobs)
    .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)))
    .limit(1);

  if (existing[0]) {
    await db
      .delete(savedJobs)
      .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)));
    return { saved: false };
  }

  await db.insert(savedJobs).values({ userId, jobId });
  return { saved: true };
};

export const getSavedJobsService = async (userId: number) => {
  const rows = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      slug: jobs.slug,
      company: jobs.company,
      companyLogo: jobs.companyLogo,
      location: jobs.location,
      skills: jobs.skills,
      salary: jobs.salary,
      jobType: jobs.jobType,
      applyUrl: jobs.applyUrl,
      sourceUrl: jobs.sourceUrl,
      postedAt: jobs.postedAt,
      applyCount: jobs.applyCount,
      savedAt: savedJobs.createdAt,
    })
    .from(savedJobs)
    .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
    .where(
      and(
        eq(savedJobs.userId, userId),
        eq(jobs.isActive, true),
        eq(jobs.isDeleted, false),
      ),
    )
    .orderBy(savedJobs.createdAt);

  if (rows.length === 0) return [];

  const jobIds = rows.map((r) => r.id);

  const appliedRows = await db
    .select({ jobId: jobApplications.jobId })
    .from(jobApplications)
    .where(
      and(
        eq(jobApplications.userId, userId),
        inArray(jobApplications.jobId, jobIds),
      ),
    );

  const appliedSet = new Set(appliedRows.map((r) => r.jobId));

  return rows.map((job) => ({
    ...job,
    isSaved: 1,
    isApplied: appliedSet.has(job.id) ? 1 : 0,
  }));
};

export const getAppliedJobsService = async (userId: number) => {
  const rows = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      slug: jobs.slug,
      company: jobs.company,
      location: jobs.location,
      skills: jobs.skills,
      salary: jobs.salary,
      jobType: jobs.jobType,
      applyUrl: jobs.applyUrl,
      sourceUrl: jobs.sourceUrl,
      postedAt: jobs.postedAt,
      applyCount: jobs.applyCount,
      appliedAt: jobApplications.createdAt,
    })
    .from(jobApplications)
    .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
    .where(
      and(
        eq(jobApplications.userId, userId),
        eq(jobs.isActive, true),
        eq(jobs.isDeleted, false),
      ),
    )
    .orderBy(desc(jobApplications.createdAt));

  if (rows.length === 0) return [];

  const jobIds = rows.map((r) => r.id);

  const savedRows = await db
    .select({ jobId: savedJobs.jobId })
    .from(savedJobs)
    .where(and(eq(savedJobs.userId, userId), inArray(savedJobs.jobId, jobIds)));

  const savedSet = new Set(savedRows.map((r) => r.jobId));

  return rows.map((job) => ({
    ...job,
    isApplied: 1,
    isSaved: savedSet.has(job.id) ? 1 : 0,
  }));
};

export const trackApplyJobService = async (userId: number, jobId: number) => {
  const inserted = await db
    .insert(jobApplications)
    .values({ userId, jobId })
    .onConflictDoNothing()
    .returning({ id: jobApplications.id });

  if (inserted.length > 0) {
    const [updated] = await db
      .update(jobs)
      .set({ applyCount: sql`${jobs.applyCount} + 1` })
      .where(eq(jobs.id, jobId))
      .returning({ applyCount: jobs.applyCount });

    return { applyCount: updated?.applyCount ?? 0 };
  }

  const [job] = await db
    .select({ applyCount: jobs.applyCount })
    .from(jobs)
    .where(eq(jobs.id, jobId))
    .limit(1);

  return { applyCount: job?.applyCount ?? 0 };
};
