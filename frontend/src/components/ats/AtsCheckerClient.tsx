"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
  Briefcase,
  RefreshCw,
  Search,
  Zap,
  Target,
  ListOrdered,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import api from "@/lib/axios";
import { trackEvent } from "@/lib/analytics";
import AtsScoreGauge from "@/components/ats/AtsScoreGauge";
import AtsMetricAccordion from "@/components/ats/AtsMetricAccordion";
import AtsBulletOptimizer from "@/components/ats/AtsBulletOptimizer";
import AtsKeywordsCard from "@/components/ats/AtsKeywordsCard";
import type { ATSScanResult } from "@/types/ats";

// 12 dynamic animated scanning status messages
const SCAN_STEPS = [
  "Parsing PDF binary and extracting document text...",
  "Scanning document structural hierarchy & typography...",
  "Auditing Contact Information & professional links...",
  "Verifying standard ATS section headers & chronological flow...",
  "Analyzing action verbs & grammatical sentence tense...",
  "Detecting quantifiable metrics, numbers, and scale indicators...",
  "Matching technical skills vs enterprise market standards...",
  "Identifying missing critical domain keywords & soft skills...",
  "Evaluating brevity, sentence complexity & fluff words...",
  "Generating high-impact STAR bullet point rewrites...",
  "Calculating weighted 7-pillar composite score...",
  "Finalizing your comprehensive ATS compatibility report...",
];

const POPULAR_ROLES = [
  "Full Stack Developer",
  "Frontend Engineer (React/Next.js)",
  "Backend Developer (Node/Python)",
  "DevOps / Cloud Engineer",
  "Data Scientist",
  "Product Manager",
];

export default function AtsCheckerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [scanProgress, setScanProgress] = useState(10);
  const [result, setResult] = useState<ATSScanResult | null>(null);
  const [activeTab, setActiveTab] = useState<"rewrites" | "keywords" | "all">("rewrites");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  // Handle URL params if jobId is passed
  const jobIdParam = searchParams.get("jobId");

  useEffect(() => {
    if (jobIdParam) {
      api
        .get(`/jobs/${jobIdParam}`)
        .then((res) => {
          const job = res.data?.data;
          if (job) {
            setTargetRole(job.title || "");
            const skillsStr = Array.isArray(job.skills) ? job.skills.join(", ") : "";
            setJobDescription(
              `Role: ${job.title}\nCompany: ${job.company}\nSkills: ${skillsStr}\n\n${job.description || ""}`,
            );
            toast.info(`Loaded target job: ${job.title}`);
          }
        })
        .catch(() => {});
    }
  }, [jobIdParam]);

  // 12-Step Dynamic Scanning Progress Timer
  useEffect(() => {
    if (!isScanning) {
      setScanProgress(10);
      return;
    }

    const stepInterval = setInterval(() => {
      setScanStepIndex((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => (prev < 94 ? prev + Math.floor(Math.random() * 5 + 3) : 95));
    }, 450);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isScanning]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setErrorMessage(null);
    setIsRateLimited(false);

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (
      !allowedTypes.includes(selectedFile.type) &&
      !selectedFile.name.match(/\.(pdf|docx)$/i)
    ) {
      setErrorMessage("Please upload a valid PDF or DOCX resume document.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMessage("File size must be under 5MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleRunScan = async () => {
    if (!file) {
      setErrorMessage("Please select a resume file to scan.");
      return;
    }

    setIsScanning(true);
    setScanStepIndex(0);
    setScanProgress(15);
    setErrorMessage(null);
    setIsRateLimited(false);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      if (targetRole.trim()) formData.append("targetRole", targetRole.trim());
      if (jobDescription.trim()) formData.append("jobDescription", jobDescription.trim());
      if (jobIdParam) formData.append("jobId", jobIdParam);

      const response = await api.post("/ats/check", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success && response.data?.data) {
        setResult(response.data.data);
        trackEvent("ats_scan_completed", {
          score: response.data.data.overallScore,
          has_jd: !!jobDescription.trim(),
        });
        toast.success("ATS scan completed successfully!");
      } else {
        throw new Error(response.data?.message || "Failed to process ATS scan");
      }
    } catch (err: any) {
      console.error("[ATS Scan Error]", err);
      if (err.response?.status === 429) {
        setIsRateLimited(true);
        setErrorMessage(
          err.response?.data?.message ||
            "You have reached the daily limit of 3 ATS scans per IP. Please try again tomorrow.",
        );
      } else {
        setErrorMessage(
          err.response?.data?.message ||
            "An error occurred while analyzing your resume. Please try again.",
        );
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFile(null);
    setErrorMessage(null);
    setIsRateLimited(false);
  };

  const passedMetricsCount = result
    ? Object.values(result.metrics).filter((m) => m.status === "pass").length
    : 0;
  const totalMetricsCount = result ? Object.keys(result.metrics).length : 7;

  return (
    <div className="w-full">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
          }
        }}
      />

      {/* 1. UPLOAD VIEW (High Density Side-by-Side) */}
      {!result && !isScanning && (
        <div className="rounded-3xl bg-white border border-[#e2eaf8] p-6 sm:p-8 shadow-sm space-y-6">
          {/* Rate limit warning alert */}
          {isRateLimited && (
            <Alert className="bg-amber-50 border-amber-200 text-amber-900 rounded-2xl">
              <Clock className="size-4 text-amber-600" />
              <AlertTitle className="font-bold">Daily Limit Reached (3 Scans / Day)</AlertTitle>
              <AlertDescription className="text-xs sm:text-sm mt-1">
                To prevent server overload, each IP is limited to 3 scans per 24 hours. Your limit resets tomorrow.
              </AlertDescription>
            </Alert>
          )}

          {/* General error message */}
          {errorMessage && !isRateLimited && (
            <Alert className="bg-red-50 border-red-200 text-red-900 rounded-2xl">
              <AlertCircle className="size-4 text-red-600" />
              <AlertTitle className="font-bold">Notice</AlertTitle>
              <AlertDescription className="text-xs sm:text-sm mt-1">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Col: Drag & Drop Dropzone */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm sm:text-base font-bold text-[#0c1a3a]">
                    1. Upload Resume Document
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    PDF & DOCX
                  </span>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => !file && fileInputRef.current?.click()}
                  className={`relative rounded-2xl border-2 border-dashed transition-all p-6 sm:p-8 text-center cursor-pointer flex flex-col items-center justify-center min-h-[220px] ${
                    dragging
                      ? "border-primary bg-primary/5"
                      : file
                      ? "border-emerald-400 bg-emerald-50/20"
                      : "border-[#ccd9f0] hover:border-primary bg-[#fbfdff] hover:bg-white"
                  }`}
                >
                  {file ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0c1a3a] max-w-[220px] truncate mx-auto">
                          {file.name}
                        </h4>
                        <p className="text-[11px] text-[#7a92c1] mt-0.5">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB · Ready
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="rounded-xl text-[11px] font-semibold h-8 cursor-pointer mt-1"
                      >
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto transition-transform group-hover:scale-105 shadow-2xs">
                        <Upload size={22} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0c1a3a]">
                          Drop your resume here
                        </h4>
                        <p className="text-[11px] text-[#7a92c1] mt-0.5">
                          or click to browse from device (max 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 text-[11px] text-[#7a92c1] flex items-center justify-between">
                <span>🔒 100% Secure & Private</span>
                <span>⚡ 3 Free Scans / Day</span>
              </div>
            </div>

            {/* Right Col: Target Role & Job Description Inputs */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4 bg-[#f8fbff] rounded-2xl p-5 sm:p-6 border border-[#e2eaf8]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-[#0c1a3a]">
                    2. Target Role & Job Match (Optional)
                  </h3>
                  <span className="text-[10px] font-bold text-[#2d4070] bg-white border border-[#e2eaf8] px-2 py-0.5 rounded-md">
                    Recommended
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2d4070] mb-1 block">
                    Target Job Title
                  </label>
                  <Input
                    placeholder="e.g. Senior Full Stack Engineer, Product Manager"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="rounded-xl border-[#e2eaf8] text-xs sm:text-sm bg-white h-9"
                  />
                  {/* Quick trending pills */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {POPULAR_ROLES.slice(0, 3).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setTargetRole(r)}
                        className="text-[10px] font-semibold text-[#2d4070] bg-white border border-[#e2eaf8] hover:border-primary px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                      >
                        + {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2d4070] mb-1 block">
                    Target Job Description (Paste text)
                  </label>
                  <Textarea
                    placeholder="Paste job description requirements or leave blank for industry benchmark..."
                    rows={3}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="rounded-xl border-[#e2eaf8] text-xs bg-white resize-none"
                  />
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleRunScan}
                disabled={!file || isRateLimited}
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md shadow-primary/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                <span>Run Instant AI ATS Audit</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. LOADING STATE (12-Step Dynamic Status Indicator) */}
      {isScanning && (
        <div className="rounded-3xl bg-white border border-[#e2eaf8] p-8 sm:p-14 text-center shadow-sm space-y-6 max-w-2xl mx-auto">
          {/* Radar animation icon */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/15 animate-ping" />
            <div className="relative w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles size={28} className="animate-spin" />
            </div>
          </div>

          <div className="space-y-2">
            <h3
              className="text-lg sm:text-xl font-bold text-[#0c1a3a]"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Auditing Resume Against ATS Standards
            </h3>

            {/* Dynamic keyword status text (12 steps) */}
            <div className="h-7 flex items-center justify-center">
              <p className="text-xs sm:text-sm font-bold text-primary transition-all duration-300 animate-pulse">
                {SCAN_STEPS[scanStepIndex]}
              </p>
            </div>

            {/* Percentage Progress Bar */}
            <div className="max-w-md mx-auto pt-3">
              <div className="flex justify-between text-[11px] font-bold text-[#7a92c1] mb-1">
                <span>Phase {scanStepIndex + 1} of 12</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#edf2f9] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. RESULTS VIEW (High-Density 2-Column Split Dashboard) */}
      {result && (
        <div className="space-y-5 animate-in fade-in-50 duration-400">
          {/* Top Compact Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#e2eaf8] shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0 font-bold">
                <CheckCircle size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-[#0c1a3a] truncate">
                  Report: {file?.name || "Uploaded Resume"}
                </h3>
                <p className="text-[11px] text-[#7a92c1] truncate">
                  Target: {result.targetRole || "Software Professional"} · {passedMetricsCount}/{totalMetricsCount} Pillars Passed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link href="/jobs">
                <Button
                  size="sm"
                  className="rounded-xl font-bold text-xs h-8 gap-1.5 cursor-pointer shadow-xs"
                >
                  <Search size={13} />
                  <span>Find Jobs</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="rounded-xl font-semibold text-xs h-8 gap-1.5 cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Scan New</span>
              </Button>
            </div>
          </div>

          {/* 2-Column Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column (5 Cols: Score Gauge + 7 Pillars Accordion) */}
            <div className="lg:col-span-5 space-y-4">
              <AtsScoreGauge
                score={result.overallScore}
                verdict={result.verdict}
                summaryText={result.summaryText}
                targetRole={result.targetRole}
                passedMetricsCount={passedMetricsCount}
                totalMetricsCount={totalMetricsCount}
              />

              <AtsMetricAccordion metrics={result.metrics} />
            </div>

            {/* Right Column (7 Cols: Tabbed Rewrites & Keywords Matrix) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Tab Selector Bar */}
              <div className="flex items-center justify-between p-1 bg-white rounded-2xl border border-[#e2eaf8] shadow-xs">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("rewrites")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "rewrites"
                        ? "bg-primary text-white shadow-xs"
                        : "text-[#2d4070] hover:bg-[#f8fbff]"
                    }`}
                  >
                    <Zap size={13} />
                    <span>STAR Rewrites ({result.bulletSuggestions?.length || 0})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("keywords")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "keywords"
                        ? "bg-primary text-white shadow-xs"
                        : "text-[#2d4070] hover:bg-[#f8fbff]"
                    }`}
                  >
                    <Target size={13} />
                    <span>Keywords Matrix</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("all")}
                    className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "all"
                        ? "bg-primary text-white shadow-xs"
                        : "text-[#2d4070] hover:bg-[#f8fbff]"
                    }`}
                  >
                    <ListOrdered size={13} />
                    <span>All Insights</span>
                  </button>
                </div>

                <span className="text-[10px] font-semibold text-[#7a92c1] pr-2 hidden sm:inline">
                  AI Optimization
                </span>
              </div>

              {/* Tab Contents */}
              {activeTab === "rewrites" && (
                <AtsBulletOptimizer suggestions={result.bulletSuggestions} />
              )}

              {activeTab === "keywords" && (
                <AtsKeywordsCard
                  skillsFound={result.skillsFound}
                  missingKeywords={result.missingKeywords}
                  generalSuggestions={result.generalSuggestions}
                />
              )}

              {activeTab === "all" && (
                <div className="space-y-4">
                  <AtsBulletOptimizer suggestions={result.bulletSuggestions} />
                  <AtsKeywordsCard
                    skillsFound={result.skillsFound}
                    missingKeywords={result.missingKeywords}
                    generalSuggestions={result.generalSuggestions}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
