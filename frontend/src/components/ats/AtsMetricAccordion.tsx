"use client";
import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from "lucide-react";
import type { ATSMetricDetail } from "@/types/ats";

interface Props {
  metrics: {
    bulletPoints: ATSMetricDetail;
    quantifiableMetrics: ATSMetricDetail;
    grammarAndTone: ATSMetricDetail;
    keywordsAndSkills: ATSMetricDetail;
    formattingAndHierarchy: ATSMetricDetail;
    contactInformation: ATSMetricDetail;
    brevityAndLength: ATSMetricDetail;
  };
}

export default function AtsMetricAccordion({ metrics }: Props) {
  const [openKey, setOpenKey] = useState<string | null>("bulletPoints");

  const toggleItem = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  const metricList = Object.entries(metrics);

  return (
    <div className="rounded-2xl bg-white border border-[#e2eaf8] p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[#e2eaf8]">
        <div>
          <h3
            className="text-sm sm:text-base font-bold text-[#0c1a3a]"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            7 ATS Core Pillars
          </h3>
          <p className="text-[11px] text-[#7a92c1]">
            Click any pillar to inspect observations & fixes
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {metricList.map(([key, item]) => {
          const isOpen = openKey === key;

          const isPass = item.status === "pass";
          const isFail = item.status === "fail";

          let statusClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
          let barColor = "bg-emerald-500";
          let StatusIcon = CheckCircle2;
          let label = "Pass";

          if (isFail) {
            statusClass = "text-red-700 bg-red-50 border-red-200";
            barColor = "bg-red-500";
            StatusIcon = XCircle;
            label = "Fail";
          } else if (item.status === "warning") {
            statusClass = "text-amber-700 bg-amber-50 border-amber-200";
            barColor = "bg-amber-500";
            StatusIcon = AlertTriangle;
            label = "Review";
          }

          return (
            <div
              key={key}
              className={`rounded-xl border transition-all overflow-hidden ${
                isOpen
                  ? "border-primary/40 bg-[#f8fbff] shadow-xs"
                  : "border-[#e2eaf8] bg-white hover:border-[#ccd9f0]"
              }`}
            >
              {/* Header Row */}
              <button
                type="button"
                onClick={() => toggleItem(key)}
                className="w-full flex items-center justify-between p-3 text-left gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${statusClass}`}
                  >
                    <StatusIcon className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs sm:text-sm font-bold text-[#0c1a3a] truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-2 py-0.2 rounded-md text-[10px] font-bold border ${statusClass}`}
                        >
                          {label}
                        </span>
                        <span className="text-xs font-bold text-[#0c1a3a]">
                          {item.score}%
                        </span>
                      </div>
                    </div>

                    {/* Mini progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-[#edf2f9] mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColor} transition-all duration-500`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-[#7a92c1] shrink-0 ml-1">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {/* Expandable Drilldown */}
              {isOpen && (
                <div className="px-3 pb-3.5 pt-1 space-y-2.5 text-xs text-[#2d4070] border-t border-[#e2eaf8]/80 bg-white">
                  <p className="text-xs text-[#4a5e8a] font-medium leading-relaxed italic bg-[#f8fbff] p-2 rounded-lg border border-[#e2eaf8]/50">
                    &ldquo;{item.summary}&rdquo;
                  </p>

                  {/* Findings */}
                  <div>
                    <span className="font-bold text-[10px] uppercase text-[#7a92c1] tracking-wider block mb-1">
                      Key Findings:
                    </span>
                    <ul className="space-y-1">
                      {item.findings.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1.5 text-[11px] sm:text-xs"
                        >
                          <span
                            className={`size-1 rounded-full mt-1.5 shrink-0 ${
                              isPass
                                ? "bg-emerald-500"
                                : isFail
                                  ? "bg-red-500"
                                  : "bg-amber-500"
                            }`}
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Tip */}
                  {item.tips && item.tips.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/15 text-[11px] sm:text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-primary mb-1">
                        <Lightbulb
                          size={12}
                          className="text-amber-500 fill-amber-500"
                        />
                        <span>Actionable Tip:</span>
                      </div>
                      <p className="text-[#0c1a3a]/80">{item.tips[0]}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
