import {
  remotiveResponseSchema,
  type RemotiveJob,
  type NormalizedJob,
  type JobType,
} from "./scraper.schema";

const REMOTIVE_BASE = "https://remotive.com/api/remote-jobs";

const TECH_CATEGORIES = [
  "software-dev",
  "devops",
  "design",
  "data",
  "product",
  "qa",
  "mobile",
] as const;

const normalizeJobType = (type?: string | null) => {
  const map: Record<string, string> = {
    full_time: "full_time",
    contract: "contract",
    freelance: "freelance",
    part_time: "part_time",
    internship: "internship",
  };
  return (map[type?.toLowerCase() ?? ""] ?? "remote") as JobType;
};

const fetchRemotiveCategory = async (
  category: string,
): Promise<RemotiveJob[]> => {
  const res = await fetch(`${REMOTIVE_BASE}?category=${category}&limit=2`);

  if (!res.ok) {
    console.warn(
      `Remotive fetch failed for category ${category}: ${res.status}`,
    );
    return [];
  }

  const json = await res.json();
  const parsed = remotiveResponseSchema.safeParse(json);

  if (!parsed.success) {
    console.warn(
      `Remotive parse failed for ${category}:`,
      parsed.error.message,
    );
    return [];
  }

  return parsed.data.jobs;
};

export const fetchRemotiveJobs = async (): Promise<NormalizedJob[]> => {
  console.log("🔍 Fetching Remotive jobs...");

  const results = await Promise.allSettled(
    TECH_CATEGORIES.map(fetchRemotiveCategory),
  );

  const allJobs = results
    .filter(
      (r): r is PromiseFulfilledResult<RemotiveJob[]> =>
        r.status === "fulfilled",
    )
    .flatMap((r) => r.value);

  return allJobs.map(
    (job): NormalizedJob => ({
      title: job.title,
      company: job.company_name,
      companyLogo: job.company_logo ?? null,
      companyDomain: null, // Remotive doesn't give domain
      location: job.candidate_required_location ?? "Remote",
      description: job.description ?? null,
      skills: job.tags,
      salary: job.salary ?? null,
      jobType: normalizeJobType(job.job_type),
      category: job.category,
      applyUrl: job.url,
      source: "remotive",
      sourceId: `remotive_${job.id}`,
      sourceUrl: job.url,
      postedAt: new Date(job.publication_date),
    }),
  );
};
