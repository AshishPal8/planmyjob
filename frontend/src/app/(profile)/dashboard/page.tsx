"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Send,
  Bookmark,
  Sparkles,
  Search,
  User as UserIcon,
  ArrowRight,
  Loader2,
  FileText,
} from "lucide-react";
import { useAuthStore, type User } from "@/store/auth-store";
import api from "@/lib/axios";
import { type BackendJob, formatPostedDate, getLogoColor } from "@/lib/jobs";

type AppliedJob = BackendJob & { appliedAt: string | null };

function JobPreviewRow({
  job,
  meta,
}: {
  job: BackendJob;
  meta: string;
}) {
  const logoColor = getLogoColor(job.company);
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-[#f8fbff] transition-colors group"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border"
        style={{
          backgroundColor: logoColor + "14",
          color: logoColor,
          borderColor: logoColor + "28",
        }}
      >
        {job.company[0]?.toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[#0c1a3a] text-sm font-semibold truncate group-hover:text-primary transition-colors">
          {job.title}
        </p>
        <p className="text-[#7a92c1] text-xs truncate">
          {job.company} · {meta}
        </p>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<AppliedJob[]>([]);
  const [saved, setSaved] = useState<BackendJob[]>([]);

  useEffect(() => {
    api
      .get("/user/profile")
      .then((res) => {
        const data = res.data?.data ?? res.data;
        if (data) setUser({ ...(user ?? {}), ...data } as User);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    api
      .get("/jobs/applied")
      .then((res) => setApplications(res.data?.data ?? []))
      .catch(() => setApplications([]));

    api
      .get("/jobs/saved")
      .then((res) => setSaved(res.data?.data ?? []))
      .catch(() => setSaved([]));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !user)
    return (
      <div className="min-h-screen bg-[#f0f5ff] flex items-center justify-center">
        <Loader2 size={32} className="text-blue-600 animate-spin" />
      </div>
    );

  const completion = user.profileScore ?? 0;

  const stats = [
    { label: "Applications", value: applications.length, icon: Send, href: "/applications", color: "#2563eb" },
    { label: "Saved Jobs", value: saved.length, icon: Bookmark, href: "/saved-jobs", color: "#0F9D58" },
    { label: "Profile Strength", value: `${completion}%`, icon: UserIcon, href: "/profile", color: "#F4B400" },
  ];

  return (
    <main className="min-h-screen bg-[#f0f5ff] lg:ml-64 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-[#0c1a3a]"
          style={{ fontFamily: "Sora,sans-serif" }}
        >
          Welcome back, {user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-[#7a92c1] text-sm mt-1">
          Here&apos;s what&apos;s happening with your job search.
        </p>
      </div>

      {completion < 60 && (
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#0c1a3a] text-sm">Complete your profile ({completion}% done)</p>
              <p className="text-xs text-[#7a92c1] mt-0.5 leading-relaxed">A complete profile gets 5× more job matches.</p>
              <div className="mt-2 h-1.5 bg-[#e2eaf8] rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${completion}%` }} />
              </div>
            </div>
            <Link href="/profile" className="shrink-0 text-xs font-semibold text-primary hover:underline whitespace-nowrap">
              Complete now
            </Link>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white border border-[#e2eaf8] rounded-2xl p-5 shadow-card hover:border-blue-200 hover:shadow-card-lg transition-all flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: color + "14", color }}
            >
              <Icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-[#0c1a3a]" style={{ fontFamily: "Sora,sans-serif" }}>{value}</p>
              <p className="text-[#7a92c1] text-xs">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link href="/jobs" className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <Search size={14} /> Find Jobs
        </Link>
        <Link href="/profile" className="btn-secondary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <UserIcon size={14} /> Edit Profile
        </Link>
        {!user.resumeUrl && (
          <Link href="/profile" className="btn-secondary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
            <FileText size={14} /> Upload Resume
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white border border-[#e2eaf8] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Send size={15} className="text-primary" />
              </div>
              <h3 className="font-bold text-[#0c1a3a] text-sm" style={{ fontFamily: "Sora,sans-serif" }}>Recent Applications</h3>
            </div>
            <Link href="/applications" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {applications.length === 0 ? (
            <Link href="/jobs" className="w-full block border-2 border-dashed border-[#e2eaf8] rounded-xl p-4 text-xs text-[#7a92c1] hover:border-primary hover:text-primary transition-colors text-center">
              No applications yet — jobs you apply to will show up here
            </Link>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 4).map((job) => (
                <JobPreviewRow key={job.id} job={job} meta={formatPostedDate(job.appliedAt)} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Saved Jobs */}
        <div className="bg-white border border-[#e2eaf8] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bookmark size={15} className="text-primary" />
              </div>
              <h3 className="font-bold text-[#0c1a3a] text-sm" style={{ fontFamily: "Sora,sans-serif" }}>Recent Saved Jobs</h3>
            </div>
            <Link href="/saved-jobs" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {saved.length === 0 ? (
            <Link href="/jobs" className="w-full block border-2 border-dashed border-[#e2eaf8] rounded-xl p-4 text-xs text-[#7a92c1] hover:border-primary hover:text-primary transition-colors text-center">
              No saved jobs yet — bookmark jobs you like to see them here
            </Link>
          ) : (
            <div className="space-y-3">
              {saved.slice(0, 4).map((job) => (
                <JobPreviewRow key={job.id} job={job} meta={formatPostedDate(job.postedAt)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
