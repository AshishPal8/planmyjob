import {
  remoteOkJobSchema,
  remoteOkResponseSchema,
  type NormalizedJob,
  type RemoteOkJob,
} from "./scraper.schema";

const REMOTEOK_URL = "https://remoteok.com/api";

const TECH_TITLE_KEYWORDS = [
  "engineer",
  "developer",
  "programmer",
  "software",
  "frontend",
  "front-end",
  "backend",
  "back-end",
  "full stack",
  "fullstack",
  "data scientist",
  "data analyst",
  "data engineer",
  "machine learning",
  "ml engineer",
  "ai engineer",
  "devops",
  "sre",
  "qa engineer",
  "mobile developer",
  "ios developer",
  "android developer",
  "cloud engineer",
  "designer",
  "principal",
  "architect",
  "tech lead",
  "technical lead",
  "security engineer",
];

const isTechTitle = (title: string): boolean => {
  const lower = title.toLowerCase();
  return TECH_TITLE_KEYWORDS.some((kw) => lower.includes(kw));
};

export const fetchRemoteOkJobs = async (): Promise<NormalizedJob[]> => {
  console.log("🔍 Fetching RemoteOK jobs...");

  const res = await fetch(REMOTEOK_URL, {
    headers: {
      // RemoteOK returns a bot-challenge page without a browser-like UA
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    },
  });

  if (!res.ok) {
    console.warn(`RemoteOK fetch failed: ${res.status}`);
    return [];
  }

  const json = await res.json();
  const parsed = remoteOkResponseSchema.safeParse(json);

  if (!parsed.success) {
    console.warn("RemoteOK parse failed:", parsed.error.message);
    return [];
  }

  // first element is always a legal-notice object with no real job fields
  const jobs: RemoteOkJob[] = parsed.data
    .map((raw) => remoteOkJobSchema.safeParse(raw))
    .filter((r): r is { success: true; data: RemoteOkJob } => r.success)
    .map((r) => r.data)
    .filter((job) => isTechTitle(job.position));

  return jobs.map(
    (job): NormalizedJob => ({
      title: job.position,
      company: job.company,
      companyLogo: job.company_logo || null,
      companyDomain: null,
      location: job.location || "Remote",
      description: job.description ?? null,
      skills: job.tags,
      salary:
        job.salary_min && job.salary_max
          ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
          : null,
      jobType: "remote",
      category: null,
      applyUrl: job.apply_url || job.url || null,
      source: "remoteok",
      sourceId: `remoteok_${job.id}`,
      sourceUrl: job.url || null,
      postedAt: new Date(job.date),
    }),
  );
};
