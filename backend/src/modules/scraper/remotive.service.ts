import {
  remotiveResponseSchema,
  type NormalizedJob,
  type JobType,
} from "./scraper.schema";

const REMOTIVE_BASE = "https://remotive.com/api/remote-jobs";

// Remotive's free tier caps out around ~34 total jobs regardless of
// `category` or `limit` — verified directly: a real category, a made-up
// nonsense category, and no category at all all returned the identical set.
// Looping over multiple categories was making 6x more requests than needed
// for zero extra jobs, and Remotive's own API notice explicitly caps usage
// at "max 4 times a day" with excessive requests getting blocked — so this
// is now a single call per run instead of one per category.
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

export const fetchRemotiveJobs = async (): Promise<NormalizedJob[]> => {
  console.log("🔍 Fetching Remotive jobs...");

  const res = await fetch(`${REMOTIVE_BASE}?limit=50`);

  if (!res.ok) {
    console.warn(`Remotive fetch failed: ${res.status}`);
    return [];
  }

  const json = await res.json();
  const parsed = remotiveResponseSchema.safeParse(json);

  if (!parsed.success) {
    console.warn("Remotive parse failed:", parsed.error.message);
    return [];
  }

  return parsed.data.jobs.map(
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
