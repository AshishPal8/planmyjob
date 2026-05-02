"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Briefcase,
  ArrowLeft,
  Bookmark,
  Share2,
  CheckCircle,
  Users,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { jobs as allJobs } from "@/data";
import type { Job } from "@/data";
import { Button } from "@/components/ui/button";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<Job | null>(null);
  const [related, setRelated] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Simulate API fetch from static data
    const foundJob = allJobs.find((j) => j.id === params.id);
    if (foundJob) {
      setJob(foundJob);
      setRelated(
        allJobs
          .filter((j) => j.id !== params.id && j.category === foundJob.category)
          .slice(0, 3),
      );
    }
    setLoading(false);
  }, [params.id]);

  const applyOnLinkedIn = () => {
    if (job) window.open(job.linkedinUrl, "_blank", "noopener,noreferrer");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#f0f5ff] flex items-center justify-center">
        <Loader2 size={32} className="text-blue-600 animate-spin" />
      </div>
    );

  if (!job)
    return (
      <div className="min-h-screen bg-[#f0f5ff]">
        <div className="max-w-7xl mx-auto px-4 pt-32 text-center">
          <h1 className="text-2xl font-bold text-[#0c1a3a] mb-4">
            Job not found
          </h1>
          <Link
            href="/jobs"
            className="btn-primary px-6 py-3 rounded-xl text-sm"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f0f5ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-[#7a92c1] hover:text-blue-600 text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header card */}
            <div className="bg-white border border-[#e2eaf8] rounded-2xl p-6 shadow-card">
              {/* Badges */}
              {(job.featured || job.urgent) && (
                <div className="flex gap-2 mb-4">
                  {job.featured && (
                    <span className="badge badge-blue">⭐ Featured</span>
                  )}
                  {job.urgent && (
                    <span className="badge badge-red">⚡ Urgent Hire</span>
                  )}
                </div>
              )}

              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 border"
                    style={{
                      backgroundColor: job.logoColor + "14",
                      color: job.logoColor,
                      borderColor: job.logoColor + "28",
                    }}
                  >
                    {job.logo}
                  </div>
                  <div>
                    <h1
                      className="text-xl font-bold text-[#0c1a3a] leading-tight mb-1"
                      style={{ fontFamily: "Sora,sans-serif" }}
                    >
                      {job.title}
                    </h1>
                    <p className="text-[#7a92c1] text-sm font-medium">
                      {job.company}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#7a92c1] mt-2">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-blue-500" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-blue-500" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={12} className="text-blue-500" />
                        {job.experience}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size={"icon"}>
                    <Share2 size={15} />
                  </Button>
                  <Button
                    onClick={() => setSaved(!saved)}
                    variant={"secondary"}
                    size={"icon"}
                  >
                    <Bookmark size={15} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {job.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-[#f0f5ff]">
                <div>
                  <span className="text-blue-600 text-xl font-bold">
                    {job.salary}
                  </span>
                  <p className="text-[#a8bcd8] text-xs mt-0.5">
                    Posted {job.posted}
                  </p>
                </div>
                <Button onClick={applyOnLinkedIn}>
                  Apply on LinkedIn <ExternalLink size={14} />
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-[#e2eaf8] rounded-2xl p-6 shadow-card">
              <h2
                className="font-bold text-[#0c1a3a] text-lg mb-4"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                About the Role
              </h2>
              <p className="text-[#2d4070] text-sm leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-white border border-[#e2eaf8] rounded-2xl p-6 shadow-card">
              <h2
                className="font-bold text-[#0c1a3a] text-lg mb-4"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                Requirements
              </h2>
              <ul className="space-y-3">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle
                      size={15}
                      className="text-blue-600 mt-0.5 shrink-0"
                    />
                    <span className="text-[#2d4070] text-sm">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-white border border-[#e2eaf8] rounded-2xl p-6 shadow-card">
              <h2
                className="font-bold text-[#0c1a3a] text-lg mb-4"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                Benefits & Perks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.benefits.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-3 bg-blue-50 border border-blue-100 rounded-xl"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />
                    <span className="text-[#2d4070] text-sm font-medium">
                      {b}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick apply */}
            <div className="bg-white border border-[#e2eaf8] rounded-2xl p-5 shadow-card">
              <h3
                className="font-bold text-[#0c1a3a] mb-4 text-sm"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                Job Overview
              </h3>
              <div className="space-y-3 text-sm mb-5">
                {[
                  ["Job Type", job.type],
                  ["Salary", job.salary],
                  ["Experience", job.experience],
                  ["Category", job.category],
                  ["Posted", job.posted],
                ].map(([l, v]) => (
                  <div
                    key={l}
                    className="flex justify-between items-center py-2 border-b border-[#f0f5ff]"
                  >
                    <span className="text-[#7a92c1]">{l}</span>
                    <span className="text-[#0c1a3a] font-medium text-right">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <Button onClick={applyOnLinkedIn}>
                Apply on LinkedIn <ExternalLink size={13} />
              </Button>
              <Button onClick={() => setSaved(!saved)} variant={"secondary"}>
                <Bookmark size={13} /> {saved ? "Saved" : "Save Job"}
              </Button>
            </div>

            {/* Stats */}
            <div className="bg-white border border-[#e2eaf8] rounded-2xl p-5 shadow-card">
              <h3
                className="font-bold text-[#0c1a3a] mb-3 text-sm"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                Job Activity
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#f0f5ff] rounded-xl p-3 text-center">
                  <p className="text-blue-600 font-bold text-xl">
                    {job.applicants}
                  </p>
                  <p className="text-[#7a92c1] text-xs mt-0.5">Applicants</p>
                </div>
                <div className="bg-[#f0f5ff] rounded-xl p-3 text-center">
                  <p className="text-blue-600 font-bold text-xl">{job.views}</p>
                  <p className="text-[#7a92c1] text-xs mt-0.5">Views</p>
                </div>
              </div>
            </div>

            {/* Company */}
            <div className="bg-white border border-[#e2eaf8] rounded-2xl p-5 shadow-card">
              <h3
                className="font-bold text-[#0c1a3a] mb-3 text-sm"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                About {job.company}
              </h3>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl mb-3 border"
                style={{
                  backgroundColor: job.logoColor + "14",
                  color: job.logoColor,
                  borderColor: job.logoColor + "28",
                }}
              >
                {job.logo}
              </div>
              <p className="text-[#7a92c1] text-sm leading-relaxed mb-3">
                {job.company} is one of India&apos;s leading companies,
                delivering innovative products to millions.
              </p>
              <div className="space-y-2 text-sm text-[#7a92c1]">
                <span className="flex items-center gap-2">
                  <Users size={12} className="text-blue-500" /> 1000–5000
                  employees
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={12} className="text-blue-500" /> Bengaluru,
                  India
                </span>
              </div>
              <Link
                href="/companies"
                className="mt-3 text-blue-600 text-sm hover:underline block"
              >
                View company profile →
              </Link>
            </div>

            {/* Similar jobs */}
            {related.length > 0 && (
              <div className="bg-white border border-[#e2eaf8] rounded-2xl p-5 shadow-card">
                <h3
                  className="font-bold text-[#0c1a3a] mb-4 text-sm"
                  style={{ fontFamily: "Sora,sans-serif" }}
                >
                  Similar Jobs
                </h3>
                <div className="space-y-3">
                  {related.map((j) => (
                    <Link
                      key={j.id}
                      href={`/jobs/${j.id}`}
                      className="flex items-center gap-3 p-3 bg-[#f8fbff] rounded-xl border border-[#e2eaf8] hover:border-blue-200 transition-all group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border"
                        style={{
                          backgroundColor: j.logoColor + "14",
                          color: j.logoColor,
                          borderColor: j.logoColor + "28",
                        }}
                      >
                        {j.logo}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[#0c1a3a] text-xs font-medium truncate group-hover:text-blue-600 transition-colors">
                          {j.title}
                        </p>
                        <p className="text-[#7a92c1] text-xs">
                          {j.company} · {j.salary}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
