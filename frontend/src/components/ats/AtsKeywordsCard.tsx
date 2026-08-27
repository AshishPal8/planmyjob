"use client";
import React, { useState } from "react";
import { Check, Plus, AlertTriangle, Target, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Props {
  skillsFound: string[];
  missingKeywords: string[];
  generalSuggestions?: string[];
}

export default function AtsKeywordsCard({
  skillsFound,
  missingKeywords,
  generalSuggestions,
}: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKey(keyword);
    toast.success(`Copied "${keyword}"`);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-4">
      {/* 2-Column Keywords Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Missing Keywords Box */}
        <div className="rounded-2xl bg-white border border-amber-200/90 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertTriangle size={13} />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0c1a3a]">
                Missing Critical Keywords
              </h4>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              {missingKeywords.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {missingKeywords.map((kw) => {
              const isCopied = copiedKey === kw;
              return (
                <button
                  key={kw}
                  type="button"
                  onClick={() => handleCopy(kw)}
                  className="group inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50/80 border border-amber-200 hover:bg-amber-100 text-[11px] font-semibold text-amber-950 transition-all cursor-pointer"
                  title="Click to copy"
                >
                  {isCopied ? (
                    <Check size={10} className="text-emerald-600" />
                  ) : (
                    <Plus size={10} className="text-amber-700 group-hover:rotate-90 transition-transform" />
                  )}
                  <span>{kw}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Found Keywords Box */}
        <div className="rounded-2xl bg-white border border-emerald-200/90 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Target size={13} />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0c1a3a]">
                Keywords Detected
              </h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {skillsFound.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {skillsFound.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50/60 border border-emerald-200 text-[11px] font-semibold text-emerald-950"
              >
                <Check size={10} className="text-emerald-600" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Action Checklist */}
      {generalSuggestions && generalSuggestions.length > 0 && (
        <div className="rounded-2xl bg-white border border-[#e2eaf8] p-4 shadow-xs space-y-2.5">
          <h4 className="text-xs sm:text-sm font-bold text-[#0c1a3a]">
            Top Recommended Action Items
          </h4>
          <ul className="space-y-1.5">
            {generalSuggestions.map((sug, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 p-2 rounded-xl bg-[#f8fbff] border border-[#e2eaf8]/60 text-xs text-[#2d4070]"
              >
                <span className="w-4 h-4 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="font-medium">{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
