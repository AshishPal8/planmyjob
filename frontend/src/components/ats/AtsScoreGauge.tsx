"use client";
import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Sparkles } from "lucide-react";

interface Props {
  score: number;
  verdict: "Ready to Apply" | "Good Match" | "Needs Improvement" | "High Risk of Rejection";
  summaryText: string;
  targetRole?: string;
  passedMetricsCount: number;
  totalMetricsCount: number;
}

export default function AtsScoreGauge({
  score,
  verdict,
  summaryText,
  targetRole,
  passedMetricsCount,
  totalMetricsCount,
}: Props) {
  // Color configuration
  let strokeColor = "#10b981"; // Emerald
  let badgeStyle = "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
  let statusIcon = CheckCircle2;

  if (score < 50) {
    strokeColor = "#ef4444"; // Red
    badgeStyle = "bg-red-500/10 text-red-700 border-red-500/20";
    statusIcon = XCircle;
  } else if (score < 70) {
    strokeColor = "#f59e0b"; // Amber
    badgeStyle = "bg-amber-500/10 text-amber-700 border-amber-500/20";
    statusIcon = AlertTriangle;
  } else if (score < 85) {
    strokeColor = "#2563eb"; // Blue
    badgeStyle = "bg-blue-500/10 text-blue-700 border-blue-500/20";
    statusIcon = ShieldCheck;
  }

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const StatusIcon = statusIcon;

  return (
    <div className="rounded-2xl bg-white border border-[#e2eaf8] p-5 shadow-xs">
      <div className="flex items-center gap-5">
        {/* Compact Radial Meter */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="text-[#edf2f9]"
              strokeWidth="9"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke={strokeColor}
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition: "stroke-dashoffset 1.2s ease-in-out",
              }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span
              className="text-2xl sm:text-3xl font-black text-[#0c1a3a] leading-none"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              {score}
            </span>
            <span className="text-[10px] font-bold text-[#7a92c1] uppercase mt-0.5">
              / 100
            </span>
          </div>
        </div>

        {/* Right Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeStyle}`}
            >
              <StatusIcon className="size-3.5" />
              <span>{verdict}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#7a92c1]">
              <Sparkles className="size-3 text-primary" />
              <span>{passedMetricsCount} of {totalMetricsCount} Pillars Passed</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#4a5e8a] leading-snug line-clamp-3">
            {summaryText}
          </p>
        </div>
      </div>
    </div>
  );
}
