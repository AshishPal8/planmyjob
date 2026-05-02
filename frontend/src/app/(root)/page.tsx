"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import JobCard from "@/components/jobs/JobCard";
import ResumeUploadModal from "@/modals/ResumeUploadModal";
import { jobs as allJobs, stats } from "@/data";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [showResume, setShowResume] = useState(false);
  const [featuredJobs] = useState(
    allJobs.filter((j) => j.featured).slice(0, 6),
  );
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    // Show resume modal for new visitors after 1.5s
    const visited = sessionStorage.getItem("fuj_visited");
    if (!visited) {
      sessionStorage.setItem("fuj_visited", "1");
      const t = setTimeout(() => setShowResume(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (location) params.set("location", location);
    window.location.href = `/jobs?${params}`;
  };

  const handleResumeComplete = (skills: string[]) => {
    // Optionally refresh jobs on homepage
    console.log("Resume analysed:", skills.length, "skills found");
  };

  return (
    <div className="min-h-screen bg-[#f0f5ff]">
      <ResumeUploadModal
        open={showResume}
        onClose={() => setShowResume(false)}
        onComplete={handleResumeComplete}
      />

      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center pt-16 overflow-hidden bg-gradient-soft">
        {/* Background elements */}
        <div className="absolute inset-0 dot-grid opacity-[0.35]" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        {/* Floating job cards */}
        <div className="hidden xl:block absolute right-12 top-1/2 -translate-y-1/2 space-y-3 animate-float pointer-events-none opacity-90">
          {[
            {
              title: "Senior Engineer",
              co: "Google",
              salary: "₹45–80L",
              color: "#4285F4",
            },
            {
              title: "Product Manager",
              co: "Swiggy",
              salary: "₹30–55L",
              color: "#FC8019",
            },
            {
              title: "Data Scientist",
              co: "Flipkart",
              salary: "₹25–50L",
              color: "#2874F0",
            },
          ].map((j, i) => (
            <div
              key={i}
              className={`card px-4 py-3 w-64 ${i === 1 ? "ml-6" : ""}`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ backgroundColor: j.color + "18", color: j.color }}
                >
                  {j.co[0]}
                </div>
                <div>
                  <p className="text-[#0c1a3a] text-xs font-semibold">
                    {j.title}
                  </p>
                  <p className="text-[#7a92c1] text-[10px]">
                    {j.co} · {j.salary}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="max-w-3xl">
            {/* Pill */}
            <div className="section-label mb-6">
              <Sparkles size={12} />
              1,20,000+ Jobs Updated Daily · 100% Free
            </div>

            <h1
              className="text-5xl lg:text-[68px] font-extrabold text-[#0c1a3a] leading-[1.1] mb-6"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Find Your <span className="text-gradient">Dream Job</span>
              <br /> in India
            </h1>

            <p className="text-[#2d4070] text-xl mb-10 leading-relaxed max-w-xl">
              Upload your resume and instantly get matched with jobs that fit
              your skills & Apply
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch}>
              <div className="bg-white border border-[#e2eaf8] rounded-2xl p-2 flex flex-col sm:flex-row gap-2 mb-4 shadow-card-lg">
                <div className="flex items-center gap-2.5 flex-1 px-3 py-1">
                  <Search size={16} className="text-blue-500 shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Job title, skills, or company..."
                    className="bg-transparent w-full text-[#0c1a3a] placeholder-[#a8bcd8] outline-none text-sm"
                  />
                </div>
                <div className="hidden sm:block w-px bg-[#e2eaf8] self-stretch my-1" />
                <div className="flex items-center gap-2.5 flex-1 px-3 py-1">
                  <MapPin size={16} className="text-blue-500 shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, state or remote..."
                    className="bg-transparent w-full text-[#0c1a3a] placeholder-[#a8bcd8] outline-none text-sm"
                  />
                </div>
                <Button type="submit">
                  Search Jobs <ArrowRight size={15} />
                </Button>
              </div>
            </form>

            {/* Upload resume CTA */}
            <button
              onClick={() => setShowResume(true)}
              className="inline-flex items-center gap-2 text-sm text-primary-600 font-medium hover:text-primary-500 transition-colors group"
            >
              <span className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                <Sparkles size={13} />
              </span>
              Upload resume for instant job matching
              <ChevronRight size={14} />
            </button>

            {/* Popular searches */}
            <div className="flex flex-wrap items-center gap-2 mt-6 text-sm">
              <span className="text-[#7a92c1]">Trending:</span>
              {[
                "React Developer",
                "Product Manager",
                "Data Scientist",
                "DevOps Engineer",
                "UI Designer",
              ].map((t) => (
                <Link
                  key={t}
                  href={`/jobs?q=${encodeURIComponent(t)}`}
                  className="px-3 py-1.5 bg-white border border-[#e2eaf8] text-[#2d4070] rounded-xl text-xs font-medium hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16">
            {stats.map((stat, i) => (
              <div key={i} className="card-flat p-4 text-center rounded-2xl">
                <div
                  className="text-2xl font-extrabold text-primary-600 mb-0.5"
                  style={{ fontFamily: "Sora,sans-serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-[#7a92c1] text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Jobs ────────────────────────────── */}
      <section className="py-20 bg-[#f0f5ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="section-label mb-3">Hand-picked for you</div>
              <h2
                className="text-3xl font-bold text-[#0c1a3a]"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                Featured Jobs
              </h2>
            </div>
            <Link
              href="/jobs"
              className="hidden md:flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
            >
              See all jobs <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/jobs"
              className="btn-secondary px-8 py-3 rounded-xl text-sm inline-flex items-center gap-2"
            >
              Browse All Jobs <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      {/* ─── CTA ──────────────────────────────────────── */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-brand rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 dot-grid opacity-10" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
            <div className="relative">
              <h2
                className="text-3xl md:text-5xl font-extrabold text-white mb-4"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                Ready to Find Your Dream Job?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                Join 50 lakh+ professionals. Upload your resume and get matched
                in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowResume(true)}
                  className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors text-base"
                >
                  <Sparkles size={18} /> Upload Resume & Match
                </button>
                <Link
                  href="/jobs"
                  className="bg-white/10 text-white border border-white/20 font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors text-base flex items-center justify-center gap-2"
                >
                  Browse All Jobs <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
