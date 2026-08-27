"use client";
import { useState, useEffect, useMemo, Suspense, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { X, SlidersHorizontal, Sparkles, Filter, Briefcase, RotateCcw, Loader2 } from "lucide-react";
import BackendJobCard from "@/components/jobs/BackendJobCard";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";
import type { BackendJob } from "@/lib/jobs";
import ResumeUploadModal from "@/modals/ResumeUploadModal";
import { categories } from "@/data";
import { Button } from "@/components/ui/button";
import JobSearchBar from "@/components/ui/JobSearchBar";
import api from "@/lib/axios";
import { trackEvent } from "@/lib/analytics";

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Remote",
];

const JOB_TYPE_MAP: Record<string, string> = {
  "Full-time": "full_time",
  "Part-time": "part_time",
  Contract: "contract",
  Internship: "internship",
  Remote: "remote",
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Engineering: [
    "engineer",
    "developer",
    "programmer",
    "backend",
    "frontend",
    "fullstack",
    "software",
  ],
  Product: ["product", "pm", "product manager"],
  Design: ["design", "ui", "ux", "graphic"],
  Marketing: ["marketing", "growth", "seo", "content", "brand"],
  Data: [
    "data",
    "analyst",
    "scientist",
    "analytics",
    "machine learning",
    "ml",
    "ai",
  ],
  Sales: ["sales", "account", "business development"],
  Finance: ["finance", "fintech", "accounting", "financial"],
  HR: ["hr", "human resource", "recruiter", "talent"],
};

const PAGE_SIZE = 30;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type JobsCacheEntry = {
  jobs: BackendJob[];
  total: number;
  page: number;
  timestamp: number;
};
const jobsCache = new Map<string, JobsCacheEntry>();

function jobsCacheKey(skills: string, loc: string, title: string) {
  return `${skills}|${loc}|${title}`;
}

const JOBS_SCROLL_KEY = "jobs-scroll-position";

let cameFromPopState = false;
if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    cameFromPopState = true;
  });
}

function JobsContent() {
  const searchParams = useSearchParams();

  const [allJobs, setAllJobs] = useState<BackendJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFromApi, setTotalFromApi] = useState(0);
  const [matched, setMatched] = useState(false);
  const [matchedTitle, setMatchedTitle] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [location, setLocation] = useState("");
  const [appliedSkills, setAppliedSkills] = useState("");
  const [appliedLocation, setAppliedLocation] = useState("");
  const [appliedTitle, setAppliedTitle] = useState("");
  const [selCat, setSelCat] = useState("");
  const [selTypes, setSelTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [sortBy, setSortBy] = useState<string>("relevance");

  const sentinelRef = useRef<HTMLDivElement>(null);

  const saveScrollPos = useCallback(() => {
    sessionStorage.setItem(JOBS_SCROLL_KEY, String(window.scrollY));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      saveScrollPos();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [saveScrollPos]);

  useEffect(() => {
    if (!loading && allJobs.length > 0 && cameFromPopState) {
      cameFromPopState = false;
      const savedY = sessionStorage.getItem(JOBS_SCROLL_KEY);
      if (savedY !== null) {
        window.scrollTo({ top: Number(savedY), behavior: "instant" });
      }
    }
  }, [loading, allJobs]);

  const callApi = useCallback(
    async (
      skillsStr: string,
      locStr: string,
      titleStr: string,
      page = 1,
      append = false,
    ) => {
      const skillsArray = skillsStr
        ? skillsStr.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const locationsArray = locStr
        ? locStr.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      if (!append) setLoading(true);
      else setLoadingMore(true);

      try {
        const res = await api.post("/jobs/match", {
          title: titleStr || "",
          skills: skillsArray,
          locations: locationsArray,
          page,
          pageSize: PAGE_SIZE,
        });

        const data = res.data?.data;
        const newJobs: BackendJob[] = data?.jobs ?? [];
        const total: number = data?.total ?? newJobs.length;

        if (append) {
          setAllJobs((prev) => {
            const merged = [...prev, ...newJobs];
            jobsCache.set(jobsCacheKey(skillsStr, locStr, titleStr), {
              jobs: merged,
              total,
              page,
              timestamp: Date.now(),
            });
            return merged;
          });
        } else {
          setAllJobs(newJobs);
          jobsCache.set(jobsCacheKey(skillsStr, locStr, titleStr), {
            jobs: newJobs,
            total,
            page: 1,
            timestamp: Date.now(),
          });
        }

        setTotalFromApi(total);
        setCurrentPage(page);

        trackEvent("job_search", {
          skills: skillsStr,
          location: locStr,
          title: titleStr,
          results_count: total,
          page,
        });
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        if (!append) setAllJobs([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    const rawSkills = searchParams.get("skills") ?? "";
    const rawLoc = searchParams.get("location") ?? "";
    const rawTitle = searchParams.get("title") ?? "";
    const rawCategory = searchParams.get("category") ?? "";

    setSkillsInput(rawSkills);
    setLocation(rawLoc);
    setAppliedSkills(rawSkills);
    setAppliedLocation(rawLoc);
    setAppliedTitle(rawTitle);

    if (rawCategory) setSelCat(rawCategory);

    const key = jobsCacheKey(rawSkills, rawLoc, rawTitle);
    const cached = jobsCache.get(key);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      setAllJobs(cached.jobs);
      setTotalFromApi(cached.total);
      setCurrentPage(cached.page);
      setLoading(false);
      return;
    }

    callApi(rawSkills, rawLoc, rawTitle, 1, false);
  }, [searchParams, callApi]);

  const displayedJobs = useMemo(() => {
    let list = [...allJobs];

    if (selCat) {
      const keywords = CATEGORY_KEYWORDS[selCat];
      if (keywords) {
        list = list.filter((j) => {
          const text = `${j.title} ${j.description ?? ""}`.toLowerCase();
          return keywords.some((k) => text.includes(k));
        });
      }
    }

    if (selTypes.length > 0) {
      const backendTypes = selTypes.map((t) => JOB_TYPE_MAP[t] ?? t);
      list = list.filter((j) => {
        const matchesType = backendTypes.includes(j.jobType ?? "");
        const matchesRemote =
          selTypes.includes("Remote") &&
          (j.location?.toLowerCase().includes("remote") ||
            (j as any).workplaceType === "remote");
        return matchesType || matchesRemote;
      });
    }

    if (sortBy === "recent") {
      list.sort(
        (a, b) =>
          new Date(b.postedAt ?? 0).getTime() - new Date(a.postedAt ?? 0).getTime(),
      );
    } else if (sortBy === "relevance") {
      list.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    }

    return list;
  }, [allJobs, selCat, selTypes, sortBy]);

  const handleSearch = () => {
    setAppliedSkills(skillsInput);
    setAppliedLocation(location);
    setMatched(false);
    setMatchedTitle("");
    callApi(skillsInput, location, appliedTitle, 1, false);
  };

  const handleLoadMore = useCallback(() => {
    if (loadingMore || loading) return;
    const next = currentPage + 1;
    callApi(appliedSkills, appliedLocation, appliedTitle, next, true);
  }, [currentPage, appliedSkills, appliedLocation, appliedTitle, loadingMore, loading, callApi]);

  const hasMore = allJobs.length < totalFromApi;

  // Infinite Scroll Trigger via Intersection Observer
  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      {
        rootMargin: "350px", // Trigger slightly before reaching the bottom
      },
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, loading, loadingMore, handleLoadMore]);

  const toggleType = (type: string) => {
    setSelTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const clearAll = () => {
    setSelCat("");
    setSelTypes([]);
    setSkillsInput("");
    setLocation("");
    setAppliedSkills("");
    setAppliedLocation("");
    setAppliedTitle("");
    setMatched(false);
    callApi("", "", "", 1, false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showResume && (
        <ResumeUploadModal
          open={showResume}
          onClose={() => setShowResume(false)}
          onComplete={(skills, _exp, title) => {
            const skillsStr = skills.join(", ");
            setSkillsInput(skillsStr);
            setAppliedSkills(skillsStr);
            setMatched(true);
            setMatchedTitle(title || "");
            callApi(skillsStr, location, title || "");
          }}
        />
      )}

      {/* ─── Top Header & Search Bar ─────────────────────── */}
      <section className="pt-28 pb-8 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {matched ? "🎯 Jobs Matched to Your Profile" : "Explore Active Opportunities"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {matched
                  ? matchedTitle
                    ? `Matched for ${matchedTitle} · sorted by AI compatibility score`
                    : "Sorted by relevance to your extracted skills"
                  : "Discover verified roles from top tech companies worldwide."}
              </p>
            </div>

            <Button
              onClick={() => setShowResume(true)}
              className="font-semibold shrink-0 gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="size-4" />
              <span>Match My Resume</span>
            </Button>
          </div>

          <JobSearchBar
            skillsValue={skillsInput}
            onSkillsChange={setSkillsInput}
            locationValue={location}
            onLocationChange={setLocation}
            onSearch={handleSearch}
            variant="jobs"
          />

          {(appliedSkills || appliedLocation) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground font-medium">Active filters:</span>
              {appliedSkills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              {appliedLocation && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-foreground text-xs font-semibold border border-border">
                  {appliedLocation}
                </span>
              )}
              <button
                onClick={clearAll}
                className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors ml-auto cursor-pointer"
              >
                Reset All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── Main Content: Static Sidebar + Scrolling Cards ──────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Static/Sticky Sidebar Filter Card */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-64 shrink-0 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7.5rem)] lg:overflow-y-auto`}
          >
            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <Filter className="size-4 text-primary" />
                  Filter Jobs
                </h3>
                {(selCat || selTypes.length > 0) && (
                  <button
                    onClick={() => {
                      setSelCat("");
                      setSelTypes([]);
                    }}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
                  Category
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelCat("")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      !selCat
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelCat(cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        selCat === cat.name
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span
                        className={`text-[10px] ${
                          selCat === cat.name ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border" />

              {/* Job Type */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
                  Job Type
                </h4>
                <div className="space-y-2">
                  {JOB_TYPES.map((t) => (
                    <label
                      key={t}
                      className="flex items-center gap-2.5 cursor-pointer group select-none text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={selTypes.includes(t)}
                        onChange={() => toggleType(t)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
                      />
                      <span
                        className={`font-medium ${
                          selTypes.includes(t)
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      >
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                onClick={clearAll}
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold rounded-xl hover:text-destructive hover:border-destructive/40 cursor-pointer"
              >
                Clear All Filters
              </Button>
            </div>
          </aside>

          {/* Scrolling Job Feed Grid */}
          <div className="flex-1 min-w-0 w-full">
            {/* Action Ticker & Sorter */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <span className="text-foreground font-bold text-base">
                  {displayedJobs.length.toLocaleString()} Openings Found
                </span>
                {matched && (
                  <span className="ml-2.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                    AI Matched
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  size="sm"
                  className="lg:hidden rounded-xl gap-1.5 text-xs font-semibold"
                >
                  <SlidersHorizontal className="size-3.5" />
                  Filters
                </Button>

                <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-1.5 shadow-2xs">
                  <span className="text-muted-foreground text-xs font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-foreground text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="recent">Most Recent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Tag Indicators */}
            {(selCat || selTypes.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selCat && (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-semibold cursor-pointer hover:bg-primary/20"
                    onClick={() => setSelCat("")}
                  >
                    {selCat} <X className="size-3" />
                  </span>
                )}
                {selTypes.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-foreground text-xs font-semibold cursor-pointer hover:bg-muted/80 border border-border"
                    onClick={() => toggleType(t)}
                  >
                    {t} <X className="size-3" />
                  </span>
                ))}
              </div>
            )}

            {/* Job Grid List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : displayedJobs.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border shadow-xs">
                <Briefcase className="size-10 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-foreground font-bold text-lg mb-1">
                  No matching jobs found
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-5">
                  Try adjusting your keywords, expanding your location, or clearing applied filters.
                </p>
                <Button
                  onClick={clearAll}
                  size="sm"
                  className="rounded-xl gap-2 font-semibold"
                >
                  <RotateCcw className="size-3.5" />
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {displayedJobs.map((job) => (
                    <BackendJobCard key={job.id} job={job} />
                  ))}
                </div>

                {/* Loading More Skeletons when fetching next page */}
                {loadingMore && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                    <JobCardSkeleton />
                    <JobCardSkeleton />
                  </div>
                )}

                {/* Invisible Infinite Scroll Sentinel Target */}
                {hasMore && (
                  <div
                    ref={sentinelRef}
                    className="h-14 w-full flex items-center justify-center text-xs text-muted-foreground gap-2 pt-6"
                  >
                    <Loader2 className="size-4 animate-spin text-primary" />
                    <span>Loading more opportunities...</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background pt-28 px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(6)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
