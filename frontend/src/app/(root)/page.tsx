"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  Upload,
  ScanSearch,
  Send,
  Star,
  Quote,
  Building2,
  CheckCircle2,
  TrendingUp,
  Zap,
} from "lucide-react";
import BackendJobCard from "@/components/jobs/BackendJobCard";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";
import ResumeUploadModal from "@/modals/ResumeUploadModal";
import { stats, categories, companies, testimonials } from "@/data";
import JobSearchBar from "@/components/ui/JobSearchBar";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import type { BackendJob } from "@/lib/jobs";

const COUNTRIES = ["India", "USA", "Canada", "UK", "Australia", "Germany", "Singapore"];

const HOW_IT_WORKS = [
  {
    icon: Upload,
    title: "Upload your resume",
    desc: "Drop your PDF, DOCX or TXT resume. It takes less than 10 seconds.",
  },
  {
    icon: ScanSearch,
    title: "AI extracts your skills",
    desc: "We parse your experience, role and skills automatically — no forms to fill.",
  },
  {
    icon: Sparkles,
    title: "Get matched instantly",
    desc: "We search jobs from our own listings plus aggregated feeds like LinkedIn, Indeed & Naukri to find your best fits.",
  },
  {
    icon: Send,
    title: "Apply with one click",
    desc: "Apply directly on the source site — no repeated data entry, no spam.",
  },
];

export default function Home() {
  const [showResume, setShowResume] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState<BackendJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [countryIdx, setCountryIdx] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      setCountryIdx((i) => (i + 1) % COUNTRIES.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Show resume modal for new visitors after 1.5s
    const visited = sessionStorage.getItem("fuj_visited");
    if (!visited) {
      sessionStorage.setItem("fuj_visited", "1");
      const t = setTimeout(() => setShowResume(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    api
      .post("/jobs/match", {
        title: "",
        skills: [],
        locations: [],
        page: 1,
        pageSize: 6,
      })
      .then((res) => setFeaturedJobs(res.data?.data?.jobs ?? []))
      .catch(() => setFeaturedJobs([]))
      .finally(() => setJobsLoading(false));
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("skills", search);
    if (location) params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
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
      <section className="relative overflow-hidden bg-gradient-soft pt-28 lg:pt-32 pb-14 lg:pb-20">
        {/* Background elements */}
        <div className="absolute inset-0 dot-grid opacity-[0.3]" />
        <div className="absolute -top-40 -right-32 w-[620px] h-[620px] bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-48 -left-40 w-[460px] h-[460px] bg-sky-300/25 rounded-full blur-3xl pointer-events-none" />

        <style>{`
          @keyframes countrySlideUp {
            from { transform: translateY(40px); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
        `}</style>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
            {/* ── Left column ───────────────────────────── */}
            <div className="max-w-xl">
              {/* Pill */}
              <div className="section-label mb-5">
                <Sparkles size={12} />
                1,20,000+ Jobs Updated Daily · 100% Free
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-[#0c1a3a] leading-[1.08] mb-5"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                Find Your Dream Job in{" "}
                <span
                  key={countryIdx}
                  className="text-gradient inline-block"
                  style={{ animation: "countrySlideUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards" }}
                >
                  {COUNTRIES[countryIdx]}
                </span>
              </h1>

              <p className="text-[#2d4070] text-lg mb-7 leading-relaxed">
                Upload your resume and instantly get matched with jobs that fit
                your skills — then apply in a single click.
              </p>

              {/* Search bar */}
              <JobSearchBar
                skillsValue={search}
                onSkillsChange={setSearch}
                locationValue={location}
                onLocationChange={setLocation}
                onSearch={handleSearch}
                variant="home"
              />

              {/* Upload resume CTA */}
              <button
                onClick={() => setShowResume(true)}
                className="inline-flex items-center gap-2 text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors group"
              >
                <span className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white group-hover:bg-primary-700 transition-colors">
                  <Sparkles size={13} />
                </span>
                Upload resume for instant job matching
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Popular searches */}
              <div className="flex flex-wrap items-center gap-2 mt-6 text-sm">
                <span className="text-[#7a92c1]">Trending:</span>
                {[
                  { label: "React Developer", skills: "React" },
                  { label: "Product Manager", skills: "Product Management" },
                  { label: "Data Scientist", skills: "Python,Machine Learning" },
                  { label: "DevOps Engineer", skills: "Docker,Kubernetes" },
                ].map(({ label, skills }) => (
                  <Link
                    key={label}
                    href={`/jobs?skills=${encodeURIComponent(skills)}`}
                    className="px-3 py-1.5 bg-white border border-[#e2eaf8] text-[#2d4070] rounded-xl text-xs font-medium hover:border-blue-300 hover:text-blue-600 transition-all"
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 mt-8">
                <div className="flex -space-x-2.5">
                  {["#2563eb", "#7c3aed", "#059669", "#ea580c"].map((c, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: c }}
                    >
                      {["A", "P", "S", "R"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[#7a92c1] text-xs">
                    Trusted by <span className="font-semibold text-[#2d4070]">50 Lakh+</span> job seekers
                  </p>
                </div>
              </div>
            </div>

            {/* ── Right column: AI match preview ─────────── */}
            <div className="relative hidden lg:block">
              {/* Main panel */}
              <div className="card shadow-card-lg p-5 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Zap size={15} />
                    </span>
                    <div>
                      <p className="text-[#0c1a3a] text-sm font-semibold" style={{ fontFamily: "Sora,sans-serif" }}>
                        AI Matches for you
                      </p>
                      <p className="text-[#7a92c1] text-[11px]">Based on your resume</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Live
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { title: "Senior Engineer", co: "Google", salary: "₹45–80L", color: "#4285F4", match: 96 },
                    { title: "Product Manager", co: "Swiggy", salary: "₹30–55L", color: "#FC8019", match: 92 },
                    { title: "Data Scientist", co: "Flipkart", salary: "₹25–50L", color: "#2874F0", match: 89 },
                  ].map((j, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[#eef3fc] hover:border-primary/30 hover:bg-primary/[0.03] transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                        style={{ backgroundColor: j.color + "18", color: j.color }}
                      >
                        {j.co[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[#0c1a3a] text-sm font-semibold truncate">{j.title}</p>
                        <p className="text-[#7a92c1] text-xs">{j.co} · {j.salary}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-green-600 text-sm font-bold">{j.match}%</p>
                        <p className="text-[#a8bcd8] text-[10px]">match</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowResume(true)}
                  className="btn-primary w-full mt-4 py-3 rounded-xl text-sm gap-2"
                >
                  <Sparkles size={15} /> Match my resume
                </button>
              </div>

              {/* Floating chip: resume analyzed */}
              <div className="absolute -top-5 -left-6 card px-4 py-3 animate-float z-20">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                    <CheckCircle2 size={16} />
                  </span>
                  <div>
                    <p className="text-[#0c1a3a] text-xs font-semibold">Resume analysed</p>
                    <p className="text-[#7a92c1] text-[10px]">42 skills detected</p>
                  </div>
                </div>
              </div>

              {/* Floating chip: applications */}
              <div className="absolute -bottom-6 -right-4 card px-4 py-3 z-20">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <TrendingUp size={16} />
                  </span>
                  <div>
                    <p className="text-[#0c1a3a] text-xs font-semibold">1,240 hires</p>
                    <p className="text-[#7a92c1] text-[10px]">this week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="card-flat rounded-2xl mt-14 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#eef3fc]">
            {stats.map((stat, i) => (
              <div key={i} className="p-5 text-center">
                <div
                  className="text-2xl lg:text-3xl font-extrabold text-primary-600 mb-0.5"
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

      {/* ─── Browse by Category ──────────────────────── */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-9">
            <div className="section-label mb-3 mx-auto">Explore</div>
            <h2
              className="text-3xl font-bold text-[#0c1a3a] mb-3"
              style={{ fontFamily: "Sora,sans-serif" }}
            >
              Browse Jobs by Category
            </h2>
            <p className="text-[#7a92c1]">
              Explore thousands of open roles across every function and industry.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/jobs?category=${encodeURIComponent(cat.name)}`}
                className="card-flat p-6 rounded-2xl text-center hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3"
                  style={{ backgroundColor: cat.color + "14" }}
                >
                  {cat.icon}
                </div>
                <h3
                  className="font-semibold text-[#0c1a3a] mb-1 group-hover:text-primary transition-colors"
                  style={{ fontFamily: "Sora,sans-serif" }}
                >
                  {cat.name}
                </h3>
                <p className="text-[#7a92c1] text-xs">
                  {cat.count.toLocaleString()}+ jobs
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* ─── Featured Jobs (live from API) ───────────── */}
      <section className="py-16 bg-[#f0f5ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="section-label mb-3 mx-auto">Fresh off our feed</div>
            <h2
              className="text-3xl font-bold text-[#0c1a3a]"
              style={{ fontFamily: "Sora,sans-serif" }}
            >
              Latest Jobs
            </h2>
            <Link
              href="/jobs"
              className="hidden md:inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium mt-2"
            >
              See all jobs <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobsLoading
              ? [...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)
              : featuredJobs.map((job) => (
                  <BackendJobCard key={job.id} job={job} />
                ))}
          </div>
          {!jobsLoading && featuredJobs.length === 0 && (
            <p className="text-center text-[#7a92c1] py-6">
              New jobs are being added — check back soon.
            </p>
          )}
          <div className="text-center mt-8">
            <Link
              href="/jobs"
              className="btn-secondary px-8 py-3 rounded-xl text-sm inline-flex items-center gap-2"
            >
              Browse All Jobs <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="section-label mb-3 mx-auto">Simple process</div>
            <h2
              className="text-3xl font-bold text-[#0c1a3a] mb-3"
              style={{ fontFamily: "Sora,sans-serif" }}
            >
              How It Works
            </h2>
            <p className="text-[#7a92c1]">
              From resume to offer letter — we cut out the manual search.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="relative card-flat p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <step.icon size={20} />
                </div>
                <div className="text-[#a8bcd8] text-xs font-bold mb-1">
                  STEP {i + 1}
                </div>
                <h3
                  className="font-semibold text-[#0c1a3a] mb-2"
                  style={{ fontFamily: "Sora,sans-serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-[#7a92c1] text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => setShowResume(true)}
              className="btn-primary px-8 py-3.5 rounded-xl text-sm inline-flex items-center gap-2"
            >
              <Sparkles size={15} /> Upload Resume & Get Matched
            </button>
          </div>
        </div>
      </section>

      {/* ─── Top Companies Hiring ─────────────────────── */}
      <section className="py-16 bg-[#f0f5ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="section-label mb-3">Trusted employers</div>
              <h2
                className="text-3xl font-bold text-[#0c1a3a]"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                Top Companies Hiring Now
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {companies.map((co) => (
              <Link
                key={co.id}
                href={`/jobs?title=${encodeURIComponent(co.name)}`}
                className="card-flat p-6 rounded-2xl text-center hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl mx-auto mb-3 border"
                  style={{
                    backgroundColor: co.color + "14",
                    color: co.color,
                    borderColor: co.color + "28",
                  }}
                >
                  {co.logo}
                </div>
                <h3
                  className="font-semibold text-[#0c1a3a] text-sm mb-1 group-hover:text-primary transition-colors"
                  style={{ fontFamily: "Sora,sans-serif" }}
                >
                  {co.name}
                </h3>
                <p className="text-[#7a92c1] text-xs flex items-center justify-center gap-1">
                  <Building2 size={11} /> {co.jobs} open roles
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="section-label mb-3 mx-auto">Success stories</div>
            <h2
              className="text-3xl font-bold text-[#0c1a3a] mb-3"
              style={{ fontFamily: "Sora,sans-serif" }}
            >
              Loved by Job Seekers
            </h2>
            <p className="text-[#7a92c1]">
              Real stories from people who found their next role with us.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="card-flat p-6 rounded-2xl flex flex-col">
                <Quote size={24} className="text-primary/30 mb-3" />
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[#2d4070] text-sm leading-relaxed mb-5 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#f0f5ff]">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0c1a3a] text-sm truncate">
                      {t.name}
                    </p>
                    <p className="text-[#7a92c1] text-xs truncate">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────── */}
      <section className="py-16 bg-primary">
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
                  className="bg-white text-primary font-semibold px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors text-base"
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
