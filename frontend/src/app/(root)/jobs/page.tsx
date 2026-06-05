"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, X, SlidersHorizontal, Sparkles } from "lucide-react";
import BackendJobCard from "@/components/jobs/BackendJobCard";
import type { BackendJob } from "@/lib/jobs";
import ResumeUploadModal from "@/modals/ResumeUploadModal";
import { categories } from "@/data";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

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

function JobsContent() {
  const searchParams = useSearchParams();

  const [allJobs, setAllJobs] = useState<BackendJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [matched, setMatched] = useState(false);
  const [matchedTitle, setMatchedTitle] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [location, setLocation] = useState("");
  const [selTypes, setSelTypes] = useState<string[]>([]);
  const [selCat, setSelCat] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [showResume, setShowResume] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const callApi = async (skills: string, loc: string, title = "") => {
    setLoading(true);
    const skillsArr = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      const res = await api.post("/jobs/match", {
        title,
        skills: skillsArr,
        locations: loc ? [loc] : [],
        page: 1,
        pageSize: 30,
      });
      setAllJobs(res.data?.data?.jobs ?? []);
    } catch {
      setAllJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const skills = searchParams.get("skills") || "";
    const loc = searchParams.get("location") || "";
    const isMatched = searchParams.get("matched") === "true";
    const title = searchParams.get("title") || "";

    setSkillsInput(skills);
    setLocation(loc);
    setMatched(isMatched);
    setMatchedTitle(title);

    callApi(skills, loc, title);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const displayedJobs = useMemo(() => {
    let result = [...allJobs];

    if (selCat && CATEGORY_KEYWORDS[selCat]) {
      const kws = CATEGORY_KEYWORDS[selCat];
      result = result.filter((j) =>
        kws.some((kw) => j.title.toLowerCase().includes(kw)),
      );
    }

    if (selTypes.length > 0) {
      result = result.filter((j) =>
        selTypes.some((t) => JOB_TYPE_MAP[t] === j.jobType),
      );
    }

    if (sortBy === "recent") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.postedAt ?? 0).getTime() -
          new Date(a.postedAt ?? 0).getTime(),
      );
    }

    return result;
  }, [allJobs, selCat, selTypes, sortBy]);

  const handleSearch = () => callApi(skillsInput, location);

  const toggleType = (t: string) =>
    setSelTypes((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const clearAll = () => {
    setSelTypes([]);
    setSelCat("");
    setSkillsInput("");
    setLocation("");
    callApi("", "");
  };

  return (
    <div className="min-h-screen bg-[#f0f5ff]">
      {showResume && (
        <ResumeUploadModal
          open={showResume}
          onClose={() => setShowResume(false)}
          onComplete={(_skills, _exp, title) => {
            setShowResume(false);
            const skillsStr = _skills.join(",");
            setSkillsInput(skillsStr);
            setMatched(true);
            setMatchedTitle(title || "");
            callApi(skillsStr, location, title);
          }}
        />
      )}

      <section className="pt-20 pb-6 bg-white border-b border-[#e2eaf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h1
                className="text-2xl font-bold text-[#0c1a3a]"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                {matched
                  ? "🎯 Jobs Matched to Your Resume"
                  : "Find Your Next Opportunity"}
              </h1>
              {matched && (
                <p className="text-blue-600 text-sm mt-0.5">
                  {matchedTitle
                    ? `Matched for ${matchedTitle} · sorted by relevance`
                    : "Sorted by relevance to your skills"}
                </p>
              )}
            </div>
            <Button onClick={() => setShowResume(true)}>
              <Sparkles size={14} /> Match My Resume
            </Button>
          </div>

          <div className="bg-[#f8fbff] border border-[#e2eaf8] rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2.5 flex-1 px-3 py-1.5">
              <Search size={15} className="text-blue-500 shrink-0" />
              <input
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Skills (e.g. react, python, aws)"
                className="bg-transparent w-full text-[#0c1a3a] placeholder-[#a8bcd8] outline-none text-sm"
              />
              {skillsInput && (
                <button onClick={() => setSkillsInput("")}>
                  <X size={13} className="text-[#a8bcd8]" />
                </button>
              )}
            </div>
            <div className="hidden sm:block w-px bg-[#e2eaf8] self-stretch my-1" />
            <div className="flex items-center gap-2.5 flex-1 px-3 py-1.5">
              <MapPin size={15} className="text-blue-500 shrink-0" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="City or remote..."
                className="bg-transparent w-full text-[#0c1a3a] placeholder-[#a8bcd8] outline-none text-sm"
              />
              {location && (
                <button onClick={() => setLocation("")}>
                  <X size={13} className="text-[#a8bcd8]" />
                </button>
              )}
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {(skillsInput || location) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {skillsInput
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((skill) => (
                  <span key={skill} className="badge badge-blue text-xs">
                    {skill}
                  </span>
                ))}
              {location && (
                <span className="badge badge-sky text-xs">{location}</span>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-7">
          <aside
            className={`${showFilters ? "block" : "hidden"} lg:block w-60 shrink-0`}
          >
            <div className="bg-white border border-[#e2eaf8] rounded-2xl p-5 sticky top-24 shadow-card space-y-6">
              <div>
                <h3
                  className="text-[#0c1a3a] text-sm font-semibold mb-3"
                  style={{ fontFamily: "Sora,sans-serif" }}
                >
                  Category
                </h3>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setSelCat("")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                      !selCat
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-[#7a92c1] hover:bg-[#f0f5ff] hover:text-[#2d4070]"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelCat(cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex justify-between ${
                        selCat === cat.name
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-[#7a92c1] hover:bg-[#f0f5ff] hover:text-[#2d4070]"
                      }`}
                    >
                      <span>
                        {cat.icon} {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <hr className="divider" />

              <div>
                <h3
                  className="text-[#0c1a3a] text-sm font-semibold mb-3"
                  style={{ fontFamily: "Sora,sans-serif" }}
                >
                  Job Type
                </h3>
                <div className="space-y-2">
                  {JOB_TYPES.map((t) => (
                    <label
                      key={t}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selTypes.includes(t)}
                        onChange={() => toggleType(t)}
                        className="accent-blue-600 w-4 h-4 rounded"
                      />
                      <span
                        className={`text-sm ${
                          selTypes.includes(t)
                            ? "text-blue-600 font-medium"
                            : "text-[#7a92c1] group-hover:text-[#2d4070]"
                        }`}
                      >
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Button onClick={clearAll} variant="outline" className="w-full">
                Clear All Filters
              </Button>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <span className="text-[#0c1a3a] font-semibold">
                  {displayedJobs.length} jobs found
                </span>
                {matched && (
                  <span className="ml-2 badge badge-green">Resume matched</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                >
                  <SlidersHorizontal size={13} /> Filters
                </Button>
                <div className="flex items-center gap-2 bg-white border border-[#e2eaf8] rounded-xl px-3 py-2 shadow-card">
                  <span className="text-[#7a92c1] text-xs">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-[#0c1a3a] text-sm outline-none cursor-pointer"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="recent">Most Recent</option>
                  </select>
                </div>
              </div>
            </div>

            {(selCat || selTypes.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selCat && (
                  <span
                    className="flex items-center gap-1.5 badge badge-blue cursor-pointer"
                    onClick={() => setSelCat("")}
                  >
                    {selCat} <X size={10} />
                  </span>
                )}
                {selTypes.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1.5 badge badge-sky cursor-pointer"
                    onClick={() => toggleType(t)}
                  >
                    {t} <X size={10} />
                  </span>
                ))}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card p-5 space-y-3">
                    <div className="skeleton h-10 w-10 rounded-xl" />
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                    <div className="flex gap-2">
                      <div className="skeleton h-6 w-16 rounded-full" />
                      <div className="skeleton h-6 w-16 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {displayedJobs.map((job) => (
                  <BackendJobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#e2eaf8]">
                <div className="text-5xl mb-4">🔍</div>
                <h3
                  className="text-xl font-bold text-[#0c1a3a] mb-2"
                  style={{ fontFamily: "Sora,sans-serif" }}
                >
                  No jobs found
                </h3>
                <p className="text-[#7a92c1] mb-6 text-sm">
                  Try different skills or clear filters
                </p>
                <Button onClick={clearAll}>Clear All Filters</Button>
              </div>
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
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
