export interface BackendJob {
  id: number;
  title: string;
  slug: string;
  company: string;
  companyLogo: string;
  location: string | null;
  skills: string[] | null;
  salary: string | null;
  jobType: string | null;
  applyUrl: string | null;
  sourceUrl: string | null;
  postedAt: string | null;
  matchScore: number;
  matchedSkills: string[];
  isSaved: number;
  isApplied: number;
  applyCount?: number;
}

export interface FullJob {
  id: number;
  title: string;
  slug: string;
  company: string;
  companyLogo: string | null;
  location: string | null;
  description: string | null;
  skills: string[] | null;
  salary: string | null;
  jobType: string | null;
  category: string | null;
  applyUrl: string | null;
  sourceUrl: string | null;
  postedAt: string | null;
  createdAt: string;
  isSaved: number;
  isApplied: number;
}

export const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
  remote: "Remote",
};

export const SCHEMA_EMPLOYMENT_TYPE: Record<string, string> = {
  full_time: "FULL_TIME",
  part_time: "PART_TIME",
  contract: "CONTRACTOR",
  freelance: "CONTRACTOR",
  internship: "INTERN",
  remote: "FULL_TIME",
};

const LOGO_COLORS = [
  "#4285F4",
  "#EA4335",
  "#0F9D58",
  "#F4B400",
  "#7B68EE",
  "#FF6B35",
  "#2196F3",
  "#9C27B0",
];

export function getLogoColor(company: string): string {
  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length];
}

export function formatPostedDate(dateStr: string | null): string {
  if (!dateStr) return "Recently posted";
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000,
  );
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted 1 day ago";
  if (days < 7) return `Posted ${days} days ago`;
  if (days < 30) return `Posted ${Math.floor(days / 7)} weeks ago`;
  return `Posted ${Math.floor(days / 30)} months ago`;
}

export function getApplyUrl(
  job: Pick<BackendJob | FullJob, "applyUrl" | "sourceUrl">,
): string {
  return job.applyUrl || job.sourceUrl || "#";
}

export function isHtmlContent(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
