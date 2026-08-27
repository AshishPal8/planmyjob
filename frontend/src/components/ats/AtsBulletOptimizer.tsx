"use client";
import React, { useState } from "react";
import { Sparkles, Copy, Check, AlertCircle, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import type { ATSBulletSuggestion } from "@/types/ats";

interface Props {
  suggestions: ATSBulletSuggestion[];
}

export default function AtsBulletOptimizer({ suggestions }: Props) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!suggestions || suggestions.length === 0) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Improved bullet point copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Sparkles size={14} />
          </div>
          <div>
            <h3
              className="text-sm sm:text-base font-bold text-[#0c1a3a]"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Side-by-Side STAR Bullet Optimizer
            </h3>
            <p className="text-[11px] text-[#7a92c1]">
              Replace weak responsibilities with quantifiable high-impact achievements
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
          {suggestions.length} Rewrites
        </span>
      </div>

      <div className="space-y-3">
        {suggestions.map((item, idx) => {
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-[#e2eaf8] bg-white p-4 transition-all hover:border-primary/30 shadow-xs space-y-3"
            >
              {/* Header with copy button */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  {item.metric && (
                    <span className="px-2 py-0.5 rounded-md bg-[#edf2f9] text-[#2d4070] text-[10px] font-bold">
                      Focus: {item.metric}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(item.improved, idx)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f8fbff] border border-[#e2eaf8] hover:border-primary hover:text-primary text-[11px] font-semibold text-[#2d4070] transition-colors cursor-pointer shadow-2xs"
                >
                  {isCopied ? (
                    <>
                      <Check size={12} className="text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy Rewrite</span>
                    </>
                  )}
                </button>
              </div>

              {/* Side by side transformation boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {/* Original (Weak) */}
                <div className="rounded-xl bg-red-50/50 border border-red-200/80 p-3 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase tracking-wider">
                    <AlertCircle size={11} />
                    <span>You Wrote (Original):</span>
                  </div>
                  <p className="text-xs text-[#0c1a3a]/80 italic leading-relaxed">
                    &ldquo;{item.original}&rdquo;
                  </p>
                </div>

                {/* Improved (STAR Formula) */}
                <div className="rounded-xl bg-emerald-50/60 border border-emerald-300/90 p-3 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    <Sparkles size={11} className="text-emerald-600" />
                    <span>AI Recommended (STAR):</span>
                  </div>
                  <p className="text-xs text-[#0c1a3a] font-semibold leading-relaxed">
                    &ldquo;{item.improved}&rdquo;
                  </p>
                </div>
              </div>

              {/* Rationale explanation */}
              {item.reason && (
                <div className="flex items-start gap-1.5 p-2 rounded-lg bg-[#f8fbff] border border-[#e2eaf8] text-[11px] text-[#4a5e8a]">
                  <Lightbulb size={12} className="text-amber-500 shrink-0 mt-0.5" />
                  <p>
                    <span className="font-bold text-[#0c1a3a]">Why this ranks higher: </span>
                    {item.reason}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
