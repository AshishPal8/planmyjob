import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Sparkles, Lock, Zap, Target, Loader2 } from "lucide-react";
import AtsCheckerClient from "@/components/ats/AtsCheckerClient";

export const metadata: Metadata = {
  title: "AI ATS Resume Checker & Optimizer | PlanUrJob",
  description:
    "Free AI-powered ATS resume checker. Audit your resume across 7 critical pillars, get side-by-side STAR bullet rewrites, and pass enterprise recruiter screening.",
  openGraph: {
    title: "AI ATS Resume Checker & Optimizer | PlanUrJob",
    description:
      "Audit your resume across 7 critical ATS pillars and get side-by-side STAR bullet rewrites to pass recruiter screening.",
    type: "website",
  },
};

export default function AtsCheckerPage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#0c1a3a] pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Compact Hero Header Section */}
        <section className="text-center pt-4 pb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-3">
            <Sparkles size={13} />
            <span>AI ATS Resume Auditor & Optimizer</span>
          </div>

          <h1
            className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0c1a3a] tracking-tight leading-tight mb-2"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Audit Your Resume Against <span className="text-primary">Enterprise ATS Filters</span>
          </h1>

          <p className="text-[#4a5e8a] text-xs sm:text-sm max-w-xl mx-auto leading-relaxed mb-3">
            Over 75% of resumes are filtered out before reaching a recruiter. Check
            your resume across 7 pillars and get instant STAR rewrites.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-[#2d4070]">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-[#e2eaf8] rounded-full shadow-2xs">
              <Lock size={11} className="text-emerald-600" /> 100% Private
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-[#e2eaf8] rounded-full shadow-2xs">
              <Zap size={11} className="text-amber-500" /> 3 Free Scans / Day
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-[#e2eaf8] rounded-full shadow-2xs">
              <Target size={11} className="text-primary" /> STAR Rewriter
            </span>
          </div>
        </section>

        {/* Interactive Client Section */}
        <section>
          <Suspense
            fallback={
              <div className="rounded-3xl bg-white border border-[#e2eaf8] p-12 text-center shadow-sm">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Loader2 className="size-8 text-primary animate-spin" />
                  <p className="text-xs font-semibold text-[#7a92c1]">
                    Initializing ATS Scanner...
                  </p>
                </div>
              </div>
            }
          >
            <AtsCheckerClient />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
