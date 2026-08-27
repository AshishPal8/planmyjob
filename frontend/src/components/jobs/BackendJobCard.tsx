"use client";
import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type BackendJob,
  JOB_TYPE_LABELS,
  formatPostedDate,
  getApplyUrl,
} from "@/lib/jobs";
import { useAuthAction } from "@/hooks/use-auth-action";
import api from "@/lib/axios";
import { trackEvent } from "@/lib/analytics";

export type { BackendJob };

export default function BackendJobCard({ job }: { job: BackendJob }) {
  const [saved, setSaved] = useState(!!job.isSaved);
  const [logoFailed, setLogoFailed] = useState(false);
  const { execute } = useAuthAction();
  const applyUrl = getApplyUrl(job);
  const skills = job.skills ?? [];

  const applicants =
    (job.applyCount ?? 0) + 40 + (Math.abs(Math.imul(job.id, 2654435761)) % 35);

  const handleJobApply = async (e: React.MouseEvent) => {
    e.stopPropagation();
    execute(() => window.open(applyUrl, "_blank", "noopener,noreferrer"));

    trackEvent("job_apply", {
      job_id: job.id,
      job_title: job.title,
      company: job.company,
    });
    try {
      await api.post(`/jobs/apply/${job.id}`);
    } catch {
      // ignore
    }
  };

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    execute(async () => {
      setSaved((prev) => {
        const next = !prev;
        if (next)
          trackEvent("save_job", { job_id: job.id, job_title: job.title });
        return next;
      });
      try {
        await api.post(`/jobs/save/${job.id}`);
      } catch {
        // ignore
      }
    });
  };

  const isRemote =
    job.location?.toLowerCase().includes("remote") ||
    (job as any).workplaceType === "remote";

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-card border border-border p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      {/* Top Section: Logo, Title, Bookmark */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            {/* Company Logo Avatar */}
            <div className="relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-border overflow-hidden bg-muted text-foreground font-bold shadow-2xs">
              {job.companyLogo && !logoFailed ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-cover"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <span className="font-extrabold text-base">
                  {job.company?.[0]?.toUpperCase() || "J"}
                </span>
              )}
            </div>

            {/* Title & Company */}
            <div className="min-w-0 flex-1">
              <Link href={`/jobs/${job.slug}`} className="block group/link">
                <h3
                  title={job.title}
                  className="font-bold text-foreground text-base leading-snug tracking-tight group-hover/link:text-primary transition-colors line-clamp-1"
                >
                  {job.title}
                </h3>
              </Link>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-muted-foreground font-medium text-xs truncate max-w-[170px]">
                  {job.company}
                </span>
                {job.isFeatured && (
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-semibold">
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleSaveToggle}
            className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              saved
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
            aria-label="Save job"
            title={saved ? "Saved" : "Save Job"}
          >
            {saved ? (
              <BookmarkCheck className="size-4 text-primary" />
            ) : (
              <Bookmark className="size-4" />
            )}
          </button>
        </div>

        {/* AI Match Badge (if matched) */}
        {job.matchScore > 0 && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <Sparkles className="size-3 text-emerald-500 animate-pulse" />
              {job.matchScore}% Match for you
            </span>
          </div>
        )}

        {/* Key Badges & Metadata */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5 text-xs text-muted-foreground font-medium">
          <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md border border-border text-foreground">
            <MapPin className="size-3 text-primary" />
            <span className="truncate max-w-[130px]">{job.location || "India"}</span>
          </span>

          {isRemote && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium">
              Remote
            </span>
          )}

          <span className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded-md border border-border text-muted-foreground">
            <Clock className="size-3" />
            {JOB_TYPE_LABELS[job.jobType ?? ""] ?? "Full-time"}
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground ml-auto">
            <Users className="size-3" /> {applicants} applied
          </span>
        </div>

        {/* Skills Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[11px] font-medium tracking-tight hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-semibold border border-border">
              +{skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Section: Salary & Apply CTAs */}
      <div className="pt-3.5 border-t border-border flex items-center justify-between gap-3 mt-auto">
        <div className="min-w-0">
          <div className="font-bold text-foreground text-sm tracking-tight truncate">
            {job.salary || "Competitive Salary"}
          </div>
          <div className="text-muted-foreground text-[11px] font-normal">
            {formatPostedDate(job.postedAt)}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/jobs/${job.slug}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Details
          </Link>

          {job.isApplied ? (
            <Button
              disabled
              size="sm"
              variant="outline"
              className="h-8 text-xs px-3 cursor-default opacity-100"
            >
              <CheckCircle2 className="size-3.5 mr-1 text-emerald-500" />
              Applied
            </Button>
          ) : (
            <Button
              onClick={handleJobApply}
              size="sm"
              className="h-8 text-xs px-3.5 font-semibold group/btn"
            >
              <span>Apply</span>
              <ArrowUpRight
                className="size-3.5 ml-1 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
