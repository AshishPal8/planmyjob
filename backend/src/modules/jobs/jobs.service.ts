import { and, eq, sql } from "drizzle-orm";
import { db } from "../../db";
import { jobs } from "../../db/schema/job.schema";
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

export const getJobsService = async (filters: GetJobsInput) => {
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

  const candidates = await db
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
      description: jobs.description,
    })
    .from(jobs)
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

  return {
    total: ranked.length,
    page,
    pageSize,
    jobs: ranked.slice(offset, offset + pageSize),
  };
};

export const getJobBySlugService = async (slug: string) => {
  const rows = await db
    .select()
    .from(jobs)
    .where(
      and(
        eq(jobs.slug, slug),
        eq(jobs.isActive, true),
        eq(jobs.isDeleted, false),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
};
