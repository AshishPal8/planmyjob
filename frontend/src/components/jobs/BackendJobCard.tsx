"use client";
import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type BackendJob,
  JOB_TYPE_LABELS,
  formatPostedDate,
  getApplyUrl,
  getLogoColor,
} from "@/lib/jobs";
import { useAuthAction } from "@/hooks/use-auth-action";
import api from "@/lib/axios";
import { trackEvent } from "@/lib/analytics";

export type { BackendJob };

export default function BackendJobCard({ job }: { job: BackendJob }) {
  const [saved, setSaved] = useState(!!job.isSaved);
  const { execute } = useAuthAction();
  const logoColor = getLogoColor(job.company);
  const applyUrl = getApplyUrl(job);
  const skills = job.skills ?? [];
  // Real applies from the API + a stable 80–120 bump (derived from the job id
  // so it doesn't change between renders) to signal healthy demand.
  const applicants =
    (job.applyCount ?? 0) + 80 + (Math.abs(Math.imul(job.id, 2654435761)) % 41);

  const handleJobApply: any = async () => {
    execute(() => window.open(applyUrl, "_blank", "noopener,noreferrer"));

    trackEvent("job_apply", {
      job_id: job.id,
      job_title: job.title,
      company: job.company,
    });
    await api.post(`/jobs/apply/${job.id}`);
  };

  const handleSaveToggle = () => {
    execute(async () => {
      setSaved((prev) => {
        const next = !prev;
        if (next)
          trackEvent("save_job", { job_id: job.id, job_title: job.title });
        return next;
      });
      await api.post(`/jobs/save/${job.id}`);
    });
  };

  return (
    <Card className="p-6 border-[#e2eaf8] shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col h-full bg-white">
      {job.matchScore > 0 && (
        <div className="flex gap-1.5 px-5 pt-4 pb-0">
          <Badge
            variant="secondary"
            className="bg-green-50 text-green-700 hover:bg-green-100"
          >
            🎯 {job.matchScore}% Match
          </Badge>
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 pt-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
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
            <div className="min-w-0 flex-1">
              <h3
                title={job.title}
                className="font-semibold text-[#0c1a3a] text-[15px] leading-snug mb-0.5 group-hover:text-primary transition-colors line-clamp-2"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                {job.title}
              </h3>
              <p
                title={job.company}
                className="text-[#7a92c1] text-sm truncate"
              >
                {job.company}
              </p>
            </div>
          </div>
          <Button
            onClick={handleSaveToggle}
            className={`shrink-0 p-1.5 rounded-lg transition-all ${
              saved
                ? "text-primary bg-primary/20"
                : "text-[#a8bcd8] hover:text-primary hover:bg-primary/10"
            }`}
            aria-label="Save job"
          >
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </Button>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#7a92c1] mb-3">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-primary shrink-0" />
            <span className="truncate">{job.location || "Remote"}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-primary shrink-0" />
            {JOB_TYPE_LABELS[job.jobType ?? ""] ?? job.jobType}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={12} className="text-primary shrink-0" />
            {applicants} applied
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.slice(0, 4).map((skill) => (
            <span key={skill} className="tag">
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="tag">+{skills.length - 4}</span>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-[#f0f5ff] text-center">
          <div>
            <span className="text-primary font-bold text-sm">
              {job.salary || "Salary not disclosed"}
            </span>
            <p className="text-[#a8bcd8] text-xs mt-0.5">
              {formatPostedDate(job.postedAt)}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 mt-3">
            <Link
              href={`/jobs/${job.slug}`}
              className="text-xs px-3 py-1.5 rounded-lg hover:bg-primary/10 hover:text-primary text-[#7a92c1] transition-colors"
            >
              Details
            </Link>
            {job.isApplied ? (
              <Button
                disabled
                className="text-xs px-4 py-1.5 rounded-lg gap-1.5 h-auto bg-green-50 text-green-700 border border-green-200 cursor-default hover:bg-green-50 disabled:opacity-100"
              >
                <CheckCircle2 size={13} /> Applied
              </Button>
            ) : (
              <Button
                onClick={handleJobApply}
                className="text-xs px-4 py-1.5 rounded-lg gap-1.5 h-auto bg-primary hover:bg-primary/90 text-white"
              >
                Apply <ExternalLink size={11} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
