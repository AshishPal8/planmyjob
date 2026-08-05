import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Clock, Calendar, Briefcase, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ApplyButton from "@/components/jobs/ApplyButton";
import BackToJobsLink from "@/components/jobs/BackToJobsLink";
import JobViewTracker from "@/components/jobs/JobViewTracker";
import {
  type FullJob,
  JOB_TYPE_LABELS,
  SCHEMA_EMPLOYMENT_TYPE,
  getLogoColor,
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${slug}`, {
      next: { revalidate: 3600 },
    });
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
      title: "Job Not Found | PlanMyJob",
      description: "This job listing could not be found.",
    };
  }

  const plain = job.description ? stripHtml(job.description) : "";
  const metaDesc =
    plain.length > 0
      ? plain.slice(0, 155) + (plain.length > 155 ? "…" : "")
      : `Apply for ${job.title} at ${job.company}${job.location ? ` in ${job.location}` : ""}. ${job.salary ?? ""}`.trim();

  return {
    title: `${job.title} at ${job.company} | PlanMyJob`,
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
  const logoColor = getLogoColor(job.company);
  const skills = job.skills ?? [];
  const hasHtml = isHtmlContent(job.description ?? "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description ? stripHtml(job.description) : undefined,
    hiringOrganization: { "@type": "Organization", name: job.company },
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
    datePosted: job.postedAt ?? job.createdAt,
    validThrough: new Date(
      new Date(job.postedAt ?? job.createdAt).getTime() + 30 * 86400000,
    ).toISOString(),
    employmentType: SCHEMA_EMPLOYMENT_TYPE[job.jobType ?? ""] ?? "OTHER",
    baseSalary: job.salary
      ? { "@type": "MonetaryAmount", description: job.salary, currency: "INR" }
      : undefined,
    skills: skills.join(", ") || undefined,
    directApply: true,
  };

  const overviewItems = [
    {
      icon: <MapPin size={15} className="text-primary" />,
      label: "Location",
      value: job.location || "Remote",
    },
    {
      icon: <Clock size={15} className="text-primary" />,
      label: "Job Type",
      value: JOB_TYPE_LABELS[job.jobType ?? ""] ?? job.jobType ?? "—",
    },
    {
      icon: <IndianRupee size={15} className="text-primary" />,
      label: "Salary",
      value: job.salary || "Not disclosed",
    },
    {
      icon: <Briefcase size={15} className="text-primary" />,
      label: "Category",
      value: job.category || "Technology",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <JobViewTracker jobId={job.id} title={job.title} company={job.company} />

      <div className="min-h-screen bg-[#f0f5ff]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-2">
          <BackToJobsLink />
        </div>

        <div className="sticky top-16 z-30 bg-white border-b border-[#e2eaf8] shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border overflow-hidden"
                  style={{
                    backgroundColor: logoColor + "14",
                    color: logoColor,
                    borderColor: logoColor + "28",
                  }}
                >
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-full h-full object-cover"
                      // onError={() => setLogoError(true)}
                    />
                  ) : (
                    <span className="font-bold text-lg">
                      {job.company?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h1
                    className="font-bold text-[#0c1a3a] text-sm sm:text-base lg:text-lg leading-tight truncate"
                    style={{ fontFamily: "Sora,sans-serif" }}
                  >
                    {job.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5 min-w-0">
                    <span
                      title={job.company}
                      className="text-[#7a92c1] text-xs sm:text-sm font-medium truncate max-w-full min-w-0"
                    >
                      {job.company}
                    </span>

                    <span className="text-[#d8e3f0] hidden sm:inline">·</span>

                    <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                      {skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="tag text-xs py-0.5">
                          {skill}
                        </span>
                      ))}
                      {skills.length > 3 && (
                        <span className="text-[#a8bcd8] text-xs">
                          +{skills.length - 3} more
                        </span>
                      )}
                    </div>

                    <span className="text-[#d8e3f0] hidden sm:inline">·</span>

                    <span className="text-[#a8bcd8] text-xs flex items-center gap-1 shrink-0">
                      <Calendar size={11} />
                      {formatPostedDate(job.postedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Apply button */}
              <ApplyButton
                applyUrl={applyUrl}
                jobId={job.id}
                label="Apply Now"
                isApplied={!!job.isApplied}
                className="shrink-0 bg-primary hover:bg-primary/90 text-white gap-1.5 px-4 sm:px-6 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-5">
          <section className="bg-white border border-[#e2eaf8] rounded-2xl p-6 shadow-sm">
            <h2
              className="font-bold text-[#0c1a3a] text-sm sm:text-base mb-5"
              style={{ fontFamily: "Sora,sans-serif" }}
            >
              Job Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {overviewItems.map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-col gap-2 p-4 bg-[#f8fbff] rounded-xl border border-[#e2eaf8]"
                >
                  <div className="flex items-center gap-1.5">
                    {icon}
                    <span className="text-[#7a92c1] text-[10px] font-semibold uppercase tracking-wider">
                      {label}
                    </span>
                  </div>
                  <span className="text-[#0c1a3a] text-sm font-semibold leading-snug">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {job.description && (
            <section className="bg-white border border-[#e2eaf8] rounded-2xl p-6 shadow-sm">
              <h2
                className="font-bold text-[#0c1a3a] text-sm sm:text-base mb-4"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                About the Role
              </h2>
              {hasHtml ? (
                <div
                  className="text-[#2d4070] text-sm leading-relaxed job-description"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(job.description),
                  }}
                />
              ) : (
                <p className="text-[#2d4070] text-sm leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              )}
            </section>
          )}

          {skills.length > 0 && (
            <section className="bg-white border border-[#e2eaf8] rounded-2xl p-6 shadow-sm">
              <h2
                className="font-bold text-[#0c1a3a] text-sm sm:text-base mb-4"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border border-blue-100 text-sm px-3 py-1 hover:bg-blue-100"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-col items-center gap-3 py-10">
            <p className="text-[#7a92c1] text-sm font-medium">
              Interested in this opportunity?
            </p>
            <ApplyButton
              applyUrl={applyUrl}
              jobId={job.id}
              label="Apply for this Position"
              appliedLabel="You've Applied"
              isApplied={!!job.isApplied}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white gap-2 px-10 rounded-xl text-base"
            />
            <p className="text-[#a8bcd8] text-xs">
              You&apos;ll be redirected to the original job posting
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
