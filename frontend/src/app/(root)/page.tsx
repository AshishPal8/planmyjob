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

  const handleResumeComplete = (skills: string[], _experience?: number, _title?: string) => {
    if (skills?.length > 0) {
      router.push(`/jobs?skills=${encodeURIComponent(skills.slice(0, 3).join(","))}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ResumeUploadModal
        open={showResume}
        onClose={() => setShowResume(false)}
        onComplete={handleResumeComplete}
      />

      {/* ─── Hero (2-Column Classic Layout, No Layout Shift) ─── */}
      <section className="relative overflow-hidden pt-28 lg:pt-36 pb-14 lg:pb-20 border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
        {/* Background elements */}
        <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />
        <div className="absolute -top-40 -right-32 w-[620px] h-[620px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-48 -left-40 w-[460px] h-[460px] bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        <style>{`
          @keyframes countrySlideUp {
            from { transform: translateY(20px); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
        `}</style>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
            {/* ── Left column ───────────────────────────── */}
            <div className="max-w-xl">
              {/* Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5 border border-primary/20">
                <Sparkles size={12} />
                1,20,000+ Jobs Updated Daily · 100% Free
              </div>

              {/* Headline with country on dedicated block line -> Zero layout shift */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-foreground leading-[1.12] mb-5 tracking-tight">
                <span>Find Your Dream Job</span>
                <span
                  key={countryIdx}
                  className="block text-primary mt-1"
                  style={{ animation: "countrySlideUp 0.35s cubic-bezier(0.22,1,0.36,1) forwards" }}
                >
                  in {COUNTRIES[countryIdx]}
                </span>
              </h1>

              <p className="text-muted-foreground text-base sm:text-lg mb-7 leading-relaxed font-normal">
                Upload your resume and instantly get matched with jobs that fit
                your skills — then apply in a single click.
              </p>

              {/* Search bar */}
              <div className="mb-4">
                <JobSearchBar
                  skillsValue={search}
                  onSkillsChange={setSearch}
                  locationValue={location}
                  onLocationChange={setLocation}
                  onSearch={handleSearch}
                  variant="home"
                />
              </div>

              {/* Upload resume CTA */}
              <button
                onClick={() => setShowResume(true)}
                className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline transition-colors group cursor-pointer"
              >
                <span className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-primary-foreground group-hover:bg-primary/90 transition-colors shadow-xs">
                  <Sparkles size={13} />
                </span>
                <span>Upload resume for instant job matching</span>
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Popular searches */}
              <div className="flex flex-wrap items-center gap-2 mt-6 text-xs">
                <span className="text-muted-foreground font-medium">Trending:</span>
                {[
                  { label: "React Developer", skills: "React" },
                  { label: "Product Manager", skills: "Product Management" },
                  { label: "Data Scientist", skills: "Python,Machine Learning" },
                  { label: "DevOps Engineer", skills: "Docker,Kubernetes" },
                ].map(({ label, skills }) => (
                  <Link
                    key={label}
                    href={`/jobs?skills=${encodeURIComponent(skills)}`}
                    className="px-3 py-1.5 bg-card border border-border text-foreground rounded-xl text-xs font-medium hover:border-primary/40 hover:text-primary transition-all shadow-2xs"
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 mt-8 pt-4 border-t border-border/60">
                <div className="flex -space-x-2.5">
                  {["#2563eb", "#7c3aed", "#059669", "#ea580c"].map((c, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-white text-xs font-bold shadow-2xs"
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
                    <span className="text-xs font-bold text-foreground ml-1">4.9/5</span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Trusted by <span className="font-semibold text-foreground">50 Lakh+</span> job seekers
                  </p>
                </div>
              </div>
            </div>

            {/* ── Right column: AI match preview ─────────── */}
            <div className="relative hidden lg:block">
              {/* Main panel */}
              <div className="bg-card border border-border rounded-3xl shadow-xl p-6 relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Zap size={16} />
                    </span>
                    <div>
                      <p className="text-foreground text-sm font-bold leading-tight">
                        AI Matches for you
                      </p>
                      <p className="text-muted-foreground text-xs">Based on your resume</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { title: "Senior Engineer", co: "Google", salary: "₹45–80L", color: "#4285F4", match: 96 },
                    { title: "Product Manager", co: "Swiggy", salary: "₹30–55L", color: "#FC8019", match: 92 },
                    { title: "Data Scientist", co: "Flipkart", salary: "₹25–50L", color: "#2874F0", match: 89 },
                  ].map((j, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-muted/60 border border-border hover:border-primary/40 hover:bg-muted transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border border-border"
                        style={{ backgroundColor: j.color + "18", color: j.color }}
                      >
                        {j.co[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground text-sm font-bold truncate">{j.title}</p>
                        <p className="text-muted-foreground text-xs">{j.co} · {j.salary}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">{j.match}%</p>
                        <p className="text-muted-foreground text-[10px]">match</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowResume(true)}
                  className="w-full mt-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={15} /> Match my resume
                </button>
              </div>

              {/* Floating chip: resume analyzed */}
              <div className="absolute -top-5 -left-6 bg-card border border-border rounded-2xl px-4 py-3 shadow-lg z-20 animate-float">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 size={16} />
                  </span>
                  <div>
                    <p className="text-foreground text-xs font-bold">Resume analysed</p>
                    <p className="text-muted-foreground text-[10px]">42 skills detected</p>
                  </div>
                </div>
              </div>

              {/* Floating chip: applications */}
              <div className="absolute -bottom-5 -right-4 bg-card border border-border rounded-2xl px-4 py-3 shadow-lg z-20">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <TrendingUp size={16} />
                  </span>
                  <div>
                    <p className="text-foreground text-xs font-bold">1,240 hires</p>
                    <p className="text-muted-foreground text-[10px]">this week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="rounded-2xl bg-card border border-border mt-14 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border shadow-xs">
            {stats.map((stat, i) => (
              <div key={i} className="p-5 text-center">
                <div className="text-2xl lg:text-3xl font-extrabold text-foreground mb-0.5">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-xs font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Jobs (live from API) ───────────── */}
      <section className="py-20 bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                Fresh off our feed
              </div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                Latest Jobs
              </h2>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-semibold"
            >
              See all jobs <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobsLoading
              ? [...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)
              : featuredJobs.map((job) => (
                  <BackendJobCard key={job.id} job={job} />
                ))}
          </div>

          {!jobsLoading && featuredJobs.length === 0 && (
            <p className="text-center text-muted-foreground py-10">
              New jobs are being added — check back soon.
            </p>
          )}

          <div className="text-center mt-10">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-card border border-border text-foreground font-semibold hover:border-primary/40 hover:text-primary transition-all shadow-xs text-sm"
            >
              Browse All Jobs <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────── */}
      <section className="py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              Simple process
            </div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">
              How It Works
            </h2>
            <p className="text-muted-foreground text-sm">
              From resume to offer letter — we cut out the manual search.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="rounded-2xl bg-card border border-border p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 font-bold">
                    <step.icon size={20} />
                  </div>
                  <div className="text-muted-foreground/40 text-xs font-bold mb-1">
                    STEP {i + 1}
                  </div>
                  <h3 className="font-bold text-foreground text-base mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => setShowResume(true)}
              className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-md shadow-primary/20 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={15} /> Upload Resume & Get Matched
            </button>
          </div>
        </div>
      </section>

      {/* ─── Top Companies Hiring ─────────────────────── */}
      <section className="py-20 bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                Trusted employers
              </div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                Top Companies Hiring Now
              </h2>
            </div>
            <Link
              href="/jobs"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all companies</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {companies.map((co) => (
              <Link
                key={co.id}
                href={`/jobs?title=${encodeURIComponent(co.name)}`}
                className="rounded-2xl bg-card border border-border p-6 text-center hover:border-primary/40 hover:shadow-md transition-all duration-200 group block"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl mx-auto mb-3 border border-border shadow-2xs"
                  style={{
                    backgroundColor: co.color + "14",
                    color: co.color,
                  }}
                >
                  {co.logo}
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                  {co.name}
                </h3>
                <p className="text-muted-foreground text-xs flex items-center justify-center gap-1 font-medium">
                  <Building2 size={11} /> {co.jobs} open roles
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────── */}
      <section className="py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              Success stories
            </div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">
              Loved by Job Seekers
            </h2>
            <p className="text-muted-foreground text-sm">
              Real stories from people who found their next role with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-2xl bg-card border border-border p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <Quote size={22} className="text-primary/30 mb-3" />
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed mb-5 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-sm truncate">
                      {t.name}
                    </p>
                    <p className="text-muted-foreground text-xs truncate">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-primary text-primary-foreground p-8 sm:p-14 text-center shadow-xl shadow-primary/15">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-3 tracking-tight">
              Ready to Find Your Dream Job?
            </h2>
            <p className="text-primary-foreground/80 text-base sm:text-lg mb-8 max-w-xl mx-auto font-normal">
              Join 50 lakh+ professionals. Upload your resume and get matched in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
              <button
                onClick={() => setShowResume(true)}
                className="bg-primary-foreground text-primary font-bold px-8 py-3.5 rounded-xl inline-flex items-center justify-center gap-2 hover:bg-primary-foreground/90 transition-colors text-sm shadow-md cursor-pointer"
              >
                <Sparkles size={16} /> Upload Resume & Match
              </button>
              <Link
                href="/jobs"
                className="bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/30 font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-foreground/20 transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                Browse All Jobs <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
