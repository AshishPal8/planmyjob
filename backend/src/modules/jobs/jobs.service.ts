import { eq, inArray, sql } from "drizzle-orm";
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
  const normalizedSkills = skills.map((s) => s.toLowerCase().trim());

  const conditions = [
    sql`${jobs.isActive}  = true`,
    sql`${jobs.isDeleted} = false`,
  ];

  if (title?.trim()) {
    conditions.push(sql`${jobs.title} ILIKE ${`%${title.trim()}%`}`);
  }

  if (jobType) {
    conditions.push(sql`${jobs.jobType} = ${jobType}::job_type`);
  }

  if (locations.length > 0) {
    conditions.push(sql`
      (${sql.join(
        locations.map((loc) => sql`${jobs.location} ILIKE ${`%${loc}%`}`),
        sql` OR `,
      )})
    `);
  }

  if (normalizedSkills.length > 0) {
    conditions.push(sql`
      ${jobs.skills} && ARRAY[
        ${sql.join(
          normalizedSkills.map((s) => sql`${s}`),
          sql`, `,
        )}
      ]::text[]
    `);
  }

  const result = await db
    .select()
    .from(jobs)
    .where(sql.join(conditions, sql` AND `));

  /**
   * Score and rank in JS after fetching.
   * Sort by: 1) match score desc 2) newest first
   */
  const ranked = result
    .map((job) => {
      const jobSkills = (job.skills ?? []).map((s) => s.toLowerCase());
      const matchedSkills = normalizedSkills.filter((s) =>
        jobSkills.includes(s),
      );
      const matchScore =
        normalizedSkills.length > 0
          ? Math.round((matchedSkills.length / normalizedSkills.length) * 100)
          : 0;
      return { ...job, matchedSkills, matchScore };
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
