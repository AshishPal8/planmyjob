import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ApplyButton from "@/components/jobs/ApplyButton";
import BackToJobsLink from "@/components/jobs/BackToJobsLink";
import JobViewTracker from "@/components/jobs/JobViewTracker";
import {
  type FullJob,
  JOB_TYPE_LABELS,
  getApplyUrl,
  formatPostedDate,
  isHtmlContent,
  sanitizeHtml,
  stripHtml,
} from "@/lib/jobs";

interface Props {
  params: Promise<{ id: string }>;
}

async function getJob(slug: string): Promise<FullJob | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/jobs/${slug}`,
      {
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    const { data } = await res.json();
    return data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return {
      title: "Job Not Found | PlanUrJob",
      description: "This job listing could not be found.",
    };
  }

  const plain = job.description ? stripHtml(job.description) : "";
  const metaDesc =
    plain.length > 0
      ? plain.slice(0, 155) + (plain.length > 155 ? "…" : "")
      : `Apply for ${job.title} at ${job.company}${job.location ? ` in ${job.location}` : ""}. ${job.salary ?? ""}`.trim();

  return {
    title: `${job.title} at ${job.company} | PlanUrJob`,
    description: metaDesc,
    keywords: [
      job.title,
      job.company,
      ...(job.skills ?? []).slice(0, 10),
      job.location ?? "",
      "jobs india",
      "apply now",
    ].filter(Boolean),
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: metaDesc,
      type: "website",
      url: `/jobs/${job.slug}`,
    },
    twitter: {
      card: "summary",
      title: `${job.title} at ${job.company}`,
      description: metaDesc,
    },
    alternates: { canonical: `/jobs/${job.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();

  const applyUrl = getApplyUrl(job);
  const skills = job.skills ?? [];
  const hasHtml = isHtmlContent(job.description ?? "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description ? stripHtml(job.description) : undefined,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      logo: job.companyLogo || undefined,
    },
    jobLocation: job.location
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location,
            addressCountry: "IN",
          },
        }
      : undefined,
    employmentType: "FULL_TIME",
    datePosted: job.postedAt,
    validThrough: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    directApply: true,
  };

  const overviewItems = [
    {
      icon: <DollarSign className="size-4 text-emerald-500" />,
      label: "Compensation",
      value: job.salary || "Competitive / Undisclosed",
    },
    {
      icon: <MapPin className="size-4 text-primary" />,
      label: "Location",
      value: job.location || "Remote",
    },
    {
      icon: <Clock className="size-4 text-muted-foreground" />,
      label: "Employment Type",
      value: JOB_TYPE_LABELS[job.jobType ?? ""] ?? "Full-time",
    },
    {
      icon: <Calendar className="size-4 text-amber-500" />,
      label: "Posted Date",
      value: formatPostedDate(job.postedAt),
    },
  ];

  return (
    <>
      <JobViewTracker jobId={job.id} title={job.title} company={job.company} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-background text-foreground pb-20">
        {/* Back Link Breadcrumb */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-3">
          <BackToJobsLink />
        </div>

        {/* Sticky Action Banner */}
        <div className="sticky top-16 z-30 bg-card/95 backdrop-blur-md border-y border-border shadow-xs">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Logo */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-border overflow-hidden bg-muted font-bold shadow-2xs">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-extrabold text-base">
                      {job.company?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h1 className="font-bold text-foreground text-base sm:text-lg leading-tight truncate">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground font-medium">
                    <span className="text-foreground font-semibold">{job.company}</span>
                    <span>•</span>
                    <span>{job.location || "Remote"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <Link href={`/ats-checker?jobId=${job.id}`}>
                  <Button
                    variant="outline"
                    className="font-bold px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm border-primary/30 text-primary hover:bg-primary/5 cursor-pointer h-10 gap-1.5"
                  >
                    <Sparkles className="size-4" />
                    <span className="hidden sm:inline">Check ATS Fit</span>
                    <span className="sm:hidden">ATS Fit</span>
                  </Button>
                </Link>

                {/* Apply CTA Button */}
                <ApplyButton
                  applyUrl={applyUrl}
                  jobId={job.id}
                  label="Apply on Company Site"
                  isApplied={!!job.isApplied}
                  className="font-bold px-5 sm:px-7 rounded-xl text-sm shadow-md shadow-primary/20 cursor-pointer h-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* 1. Overview Grid */}
          <section className="bg-card border border-border rounded-2xl p-6 shadow-xs">
            <h2 className="font-bold text-foreground text-xs uppercase tracking-wider mb-4">
              Position Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {overviewItems.map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-col gap-1.5 p-4 bg-muted/60 rounded-xl border border-border"
                >
                  <div className="flex items-center gap-1.5">
                    {icon}
                    <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                      {label}
                    </span>
                  </div>
                  <span className="text-foreground text-sm font-bold leading-snug">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Required Skills */}
          {skills.length > 0 && (
            <section className="bg-card border border-border rounded-2xl p-6 shadow-xs">
              <h2 className="font-bold text-foreground text-xs uppercase tracking-wider mb-3">
                Key Skills & Technologies
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* 3. Job Description */}
          {job.description && (
            <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2 className="font-bold text-foreground text-base sm:text-lg mb-6 pb-3 border-b border-border">
                Detailed Job Description
              </h2>
              {hasHtml ? (
                <div
                  className="text-foreground/90 text-sm leading-relaxed job-description"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(job.description),
                  }}
                />
              ) : (
                <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              )}
            </section>
          )}

          {/* 4. Bottom Action Card */}
          <div className="rounded-3xl bg-primary text-primary-foreground p-8 text-center shadow-xl shadow-primary/15">
            <h3 className="text-xl sm:text-2xl font-extrabold mb-2 text-primary-foreground">
              Interested in joining {job.company}?
            </h3>
            <p className="text-primary-foreground/80 text-sm mb-6 max-w-md mx-auto">
              Submit your application directly to the hiring team.
            </p>
            <ApplyButton
              applyUrl={applyUrl}
              jobId={job.id}
              label="Apply for this Position"
              appliedLabel="You Have Applied"
              isApplied={!!job.isApplied}
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold px-10 rounded-xl text-base shadow-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
}
