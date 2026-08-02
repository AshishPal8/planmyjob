import { envConfig } from "../../config/env.config";
import {
  jsearchResponseSchema,
  type JSearchJob,
  type NormalizedJob,
  type JobType,
} from "./scraper.schema";

const normalizeJobType = (type?: string | null) => {
  const cleaned = type?.toLowerCase().replace(/[\s_-]/g, "") ?? "";
  const map: Record<string, string> = {
    fulltime: "full_time",
    parttime: "part_time",
    contract: "contract",
    contractor: "contract",
    intern: "internship",
    internship: "internship",
    freelance: "freelance",
  };
  return (map[cleaned] ?? "full_time") as JobType;
};

const normalizeSalary = (
  min?: number | null,
  max?: number | null,
): string | null => {
  if (!min && !max) return null;
  if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  if (min) return `From $${min.toLocaleString()}`;
  return `Up to $${max!.toLocaleString()}`;
};

const extractDomain = (url?: string | null): string | null => {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return null;
  }
};

const normalizeJob = (job: JSearchJob): NormalizedJob => ({
  title: job.job_title,
  company: job.employer_name,
  companyLogo: job.employer_logo ?? null,
  companyDomain: extractDomain(job.employer_website),
  location:
    [job.job_city, job.job_country].filter(Boolean).join(", ") || "India",
  description: job.job_description ?? null,
  skills: Array.isArray(job.job_required_skills)
    ? job.job_required_skills.filter((s): s is string => typeof s === "string")
    : [],
  salary: normalizeSalary(job.job_min_salary, job.job_max_salary),
  jobType: normalizeJobType(job.job_employment_type),
  category: null,
  applyUrl: job.job_apply_link ?? null,
  source: "jsearch",
  sourceId: `jsearch_${job.job_id}`,
  sourceUrl: job.job_apply_link ?? null,
  postedAt: job.job_posted_at_datetime_utc
    ? new Date(job.job_posted_at_datetime_utc)
    : new Date(),
});

export const fetchJSearchJobs = async (): Promise<NormalizedJob[]> => {
  console.log("🔍 Fetching JSearch jobs...");

  const url = new URL("https://jsearch.p.rapidapi.com/search-v2");
  url.searchParams.set("query", "software developer engineer India");
  url.searchParams.set("num_pages", "1"); // each extra page beyond 1 typically costs its own quota unit — leave at 1
  url.searchParams.set("page", "1");
  // TODO: confirm your RapidAPI JSearch plan's actual max page_size and raise
  // this to match — 10 is a conservative placeholder, not a verified ceiling.
  url.searchParams.set("page_size", "10");
  // broadened from "today" to "week" — widens the pool of matchable postings
  // at zero extra quota cost, since page_size/date range don't affect the
  // per-call cost, only num_pages does
  url.searchParams.set("date_posted", "week");
  url.searchParams.set("country", "in");

  const res = await fetch(url.toString(), {
    headers: {
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
      "x-rapidapi-key": envConfig.jsearch.apiKey,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`JSearch fetch failed [${res.status}]:`, text);
    return [];
  }

  const json = await res.json();

  const parsed = jsearchResponseSchema.safeParse(json);

  if (!parsed.success) {
    console.error("JSearch response parse failed:", parsed.error.message);
    return [];
  }

  const jobs = parsed.data.data.jobs.map(normalizeJob);

  return jobs;
};
