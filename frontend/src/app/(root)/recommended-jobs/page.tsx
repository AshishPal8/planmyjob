"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Sparkles, Upload } from "lucide-react";
import BackendJobCard from "@/components/jobs/BackendJobCard";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";
import type { BackendJob } from "@/lib/jobs";
import ResumeUploadModal from "@/modals/ResumeUploadModal";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

const PAGE_SIZE = 30;
const SKILLS_KEY = "rj_skills";
const TITLE_KEY = "rj_title";

export default function RecommendedJobsPage() {
  const [jobs, setJobs] = useState<BackendJob[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [title, setTitle] = useState("");

  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = jobs.length < total;

  const fetchJobs = useCallback(async (skillsList: string[], jobTitle: string, pg = 1) => {
    if (pg === 1) {
      setLoading(true);
      setPage(1);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await api.post("/jobs/match", {
        title: jobTitle,
        skills: skillsList,
        locations: [],
        page: pg,
        pageSize: PAGE_SIZE,
      });
      const fetched: BackendJob[] = res.data?.data?.jobs ?? [];
      const tot: number = res.data?.data?.total ?? 0;
      setTotal(tot);
      if (pg === 1) {
        setJobs(fetched);
      } else {
        setJobs((prev) => [...prev, ...fetched]);
        setPage(pg);
      }
    } catch {
      if (pg === 1) setJobs([]);
    } finally {
      if (pg === 1) setLoading(false);
      else setLoadingMore(false);
    }
  }, []);

  // Load saved skills on mount
  useEffect(() => {
    const savedSkills = localStorage.getItem(SKILLS_KEY);
    const savedTitle = localStorage.getItem(TITLE_KEY);
    if (savedSkills) {
      const parsed: string[] = JSON.parse(savedSkills);
      setSkills(parsed);
      setTitle(savedTitle ?? "");
      fetchJobs(parsed, savedTitle ?? "");
    }
  }, [fetchJobs]);

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchJobs(skills, title, page + 1);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, page, skills, title, fetchJobs]);

  const handleResumeComplete = (extractedSkills: string[], _exp: number, jobTitle?: string) => {
    const t = jobTitle ?? "";
    localStorage.setItem(SKILLS_KEY, JSON.stringify(extractedSkills));
    localStorage.setItem(TITLE_KEY, t);
    setSkills(extractedSkills);
    setTitle(t);
    setShowResume(false);
    fetchJobs(extractedSkills, t);
  };

  const noSkills = !loading && skills.length === 0;

  return (
    <div className="min-h-screen bg-[#f0f5ff] pt-16">
      {/* Header */}
      <section className="bg-white border-b border-[#e2eaf8] pt-8 pb-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold mb-2">
              <Sparkles size={12} />
              AI-Powered
            </div>
            <h1
              className="text-2xl font-bold text-[#0c1a3a]"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Recommended Jobs
            </h1>
            {skills.length > 0 && (
              <p className="text-sm text-[#7a92c1] mt-0.5">
                {title ? `Matched for ${title} · ` : ""}
                {skills.length} skills from your resume
              </p>
            )}
          </div>
          <Button className="gap-2 rounded-xl shrink-0" onClick={() => setShowResume(true)}>
            <Upload size={14} />
            {skills.length > 0 ? "Re-upload Resume" : "Upload Resume"}
          </Button>
        </div>

        {/* Skill tags */}
        {skills.length > 0 && (
          <div className="max-w-7xl mx-auto mt-4 flex flex-wrap gap-2">
            {skills.slice(0, 12).map((s) => (
              <span
                key={s}
                className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full"
              >
                {s}
              </span>
            ))}
            {skills.length > 12 && (
              <span className="text-xs text-[#7a92c1] flex items-center">
                +{skills.length - 12} more
              </span>
            )}
          </div>
        )}
      </section>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {noSkills ? (
          /* Empty state */
          <div className="text-center py-24 bg-white rounded-2xl border border-[#e2eaf8]">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} className="text-primary" />
            </div>
            <h2
              className="text-xl font-bold text-[#0c1a3a] mb-2"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              No recommendations yet
            </h2>
            <p className="text-[#7a92c1] text-sm mb-6 max-w-sm mx-auto">
              Upload your resume and our AI will instantly match you with jobs that fit your skills and experience.
            </p>
            <Button className="gap-2 rounded-xl" onClick={() => setShowResume(true)}>
              <Upload size={15} />
              Upload My Resume
            </Button>
          </div>
        ) : (
          <>
            {!loading && (
              <p className="text-[#0c1a3a] font-semibold mb-5">
                {total} jobs matched to your profile
              </p>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)}
              </div>
            ) : jobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {jobs.map((job) => (
                    <BackendJobCard key={job.id} job={job} />
                  ))}
                </div>

                {hasMore && <div ref={sentinelRef} className="h-4 mt-4" />}

                {loadingMore && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                    {[...Array(4)].map((_, i) => <JobCardSkeleton key={i} />)}
                  </div>
                )}

                {!hasMore && (
                  <p className="text-center text-sm text-[#7a92c1] py-6">
                    All {total} jobs loaded
                  </p>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#e2eaf8]">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-[#0c1a3a] mb-2">No jobs found</h3>
                <p className="text-[#7a92c1] mb-6 text-sm">
                  Try uploading a different resume with more skills listed.
                </p>
                <Button onClick={() => setShowResume(true)}>Re-upload Resume</Button>
              </div>
            )}
          </>
        )}
      </div>

      <ResumeUploadModal
        open={showResume}
        onClose={() => setShowResume(false)}
        onComplete={handleResumeComplete}
      />
    </div>
  );
}
