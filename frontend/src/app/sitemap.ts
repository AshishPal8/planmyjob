import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://planmyjobfe.ashishpal.dev";

interface JobSlugRow {
  slug: string;
  updatedAt: string | null;
}

async function getJobSlugs(): Promise<JobSlugRow[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/sitemap/all`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const { data } = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/jobs`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/match-resume`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/salary-guide`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/interview-tips`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const jobs = await getJobSlugs();
  const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${SITE_URL}/jobs/${job.slug}`,
    lastModified: job.updatedAt ? new Date(job.updatedAt) : undefined,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...jobRoutes];
}
