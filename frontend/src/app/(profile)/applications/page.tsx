"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Send,
  MapPin,
  Clock,
  ExternalLink,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useAuthAction } from "@/hooks/use-auth-action";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import {
  type BackendJob,
  JOB_TYPE_LABELS,
  formatPostedDate,
  getApplyUrl,
  getLogoColor,
} from "@/lib/jobs";

type AppliedJob = BackendJob & { appliedAt: string | null };

export default function ApplicationsPage() {
  const { user } = useAuthStore();
  const { execute } = useAuthAction();
  const [applications, setApplications] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api
      .get("/jobs/applied")
      .then((res) => setApplications(res.data?.data ?? []))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, [user]);

  const handleReapply = (job: AppliedJob) => {
    execute(() => {
      window.open(getApplyUrl(job), "_blank", "noopener,noreferrer");
    });
  };

  if (!user || loading)
    return (
      <div className="min-h-screen bg-[#f0f5ff] flex items-center justify-center">
        <Loader2 size={32} className="text-blue-600 animate-spin" />
      </div>
    );

  return (
    <main className="min-h-screen bg-[#f0f5ff] lg:ml-64 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8 gap-3 flex-wrap">
        <div>
          <h1
            className="text-2xl font-bold text-[#0c1a3a]"
            style={{ fontFamily: "Sora,sans-serif" }}
          >
            My Applications
          </h1>
          <p className="text-[#7a92c1] text-sm mt-1">
            {applications.length} application
            {applications.length === 1 ? "" : "s"} submitted
          </p>
        </div>
        <Link
          href="/jobs"
          className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
        >
          <Search size={14} /> Find More Jobs
        </Link>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((job) => {
            const logoColor = getLogoColor(job.company);
            return (
              <div
                key={job.id}
                className="bg-white border border-[#e2eaf8] rounded-2xl p-5 shadow-card hover:border-blue-200 hover:shadow-card-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 border"
                    style={{
                      backgroundColor: logoColor + "14",
                      color: logoColor,
                      borderColor: logoColor + "28",
                    }}
                  >
                    {job.company[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={`/jobs/${job.slug}`}>
                          <h3
                            title={job.title}
                            className="text-[#0c1a3a] font-semibold group-hover:text-blue-600 transition-colors text-sm line-clamp-2"
                            style={{ fontFamily: "Sora,sans-serif" }}
                          >
                            {job.title}
                          </h3>
                        </Link>
                        <p className="text-[#7a92c1] text-sm mt-0.5 truncate">
                          {job.company}
                        </p>
                      </div>
                      <span className="shrink-0 flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 size={12} /> Applied
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#7a92c1] mt-2">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={11} className="text-blue-500" />
                        {job.location || "Remote"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={11} className="text-blue-500" />
                        {JOB_TYPE_LABELS[job.jobType ?? ""] ?? job.jobType}
                      </span>
                      <span className="text-blue-600 font-semibold">
                        {job.salary || "Salary not disclosed"}
                      </span>
                    </div>
                    {(job.skills?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.skills!.slice(0, 4).map((tag) => (
                          <span key={tag} className="tag text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-[#f0f5ff]">
                  <span className="text-[#a8bcd8] text-xs">
                    Applied · {formatPostedDate(job.appliedAt)}
                  </span>
                  <div className="flex gap-2">
                    <Link href={`/jobs/${job.slug}`}>
                      <Button variant="ghost">View Details</Button>
                    </Link>
                    <Button onClick={() => handleReapply(job)}>
                      View Application <ExternalLink size={10} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border border-[#e2eaf8] shadow-card">
          <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Send size={28} className="text-blue-600" />
          </div>
          <h3
            className="text-[#0c1a3a] text-xl font-bold mb-2"
            style={{ fontFamily: "Sora,sans-serif" }}
          >
            No applications yet
          </h3>
          <p className="text-[#7a92c1] mb-6 text-sm">
            Jobs you apply to will show up here so you can track them.
          </p>
          <Link
            href="/jobs"
            className="btn-primary px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2"
          >
            <Search size={14} /> Browse Jobs
          </Link>
        </div>
      )}
    </main>
  );
}
