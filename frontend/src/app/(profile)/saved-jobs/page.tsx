"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bookmark,
  Trash2,
  MapPin,
  Clock,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { jobs as allJobs } from "@/data";
import type { Job } from "@/data";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

export default function SavedJobsPage() {
  const [saved, setSaved] = useState<Job[]>(allJobs.slice(0, 3));
  const { user } = useAuthStore();

  const remove = (id: string) => setSaved((p) => p.filter((j) => j.id !== id));

  if (!user)
    return (
      <div className="min-h-screen bg-[#f0f5ff] flex items-center justify-center">
        <Loader2 size={32} className="text-blue-600 animate-spin" />
      </div>
    );

  return (
    <main className="min-h-screen bg-[#f0f5ff] flex-1 lg:ml-64 p-6 lg:p-3">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold text-[#0c1a3a]"
            style={{ fontFamily: "Sora,sans-serif" }}
          >
            Saved Jobs
          </h1>
          <p className="text-[#7a92c1] text-sm mt-1">
            {saved.length} jobs saved
          </p>
        </div>
        <Link
          href="/jobs"
          className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
        >
          <Search size={14} /> Find More
        </Link>
      </div>

      {saved.length > 0 ? (
        <div className="space-y-4">
          {saved.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-[#e2eaf8] rounded-2xl p-5 shadow-card hover:border-blue-200 hover:shadow-card-lg transition-all group"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 border"
                  style={{
                    backgroundColor: job.logoColor + "14",
                    color: job.logoColor,
                    borderColor: job.logoColor + "28",
                  }}
                >
                  {job.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/jobs/${job.id}`}>
                        <h3
                          className="text-[#0c1a3a] font-semibold group-hover:text-blue-600 transition-colors text-sm"
                          style={{ fontFamily: "Sora,sans-serif" }}
                        >
                          {job.title}
                        </h3>
                      </Link>
                      <p className="text-[#7a92c1] text-sm mt-0.5">
                        {job.company}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(job.id)}
                      className="text-[#a8bcd8] hover:text-red-500 transition-colors shrink-0 p-1 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#7a92c1] mt-2">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={11} className="text-blue-500" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={11} className="text-blue-500" />
                      {job.type}
                    </span>
                    <span className="text-blue-600 font-semibold">
                      {job.salary}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="tag text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f0f5ff]">
                <span className="text-[#a8bcd8] text-xs">
                  Saved · {job.posted}
                </span>
                <div className="flex gap-2">
                  <Link href={`/jobs/${job.id}`}>
                    <Button variant={"ghost"}>View Details</Button>
                  </Link>
                  <Button
                    onClick={() => window.open(job.linkedinUrl, "_blank")}
                  >
                    Apply <ExternalLink size={10} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border border-[#e2eaf8] shadow-card">
          <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Bookmark size={28} className="text-blue-600" />
          </div>
          <h3
            className="text-[#0c1a3a] text-xl font-bold mb-2"
            style={{ fontFamily: "Sora,sans-serif" }}
          >
            No saved jobs yet
          </h3>
          <p className="text-[#7a92c1] mb-6 text-sm">
            Browse jobs and click the bookmark icon to save them here.
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
