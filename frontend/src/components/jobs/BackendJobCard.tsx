"use client";
import { useState } from "react";
import {
  MapPin,
  Clock,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface BackendJob {
  id: number;
  title: string;
  slug: string;
  company: string;
  companyLogo: string | null;
  companyDomain: string | null;
  location: string | null;
  description: string | null;
  skills: string[];
  salary: string | null;
  jobType: string;
  source: string;
  sourceUrl: string | null;
  applyUrl: string | null;
  postedAt: string | null;
  createdAt: string;
  matchScore: number;
  matchedSkills: string[];
}

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
  remote: "Remote",
};

const LOGO_COLORS = [
  "#4285F4",
  "#EA4335",
  "#0F9D58",
  "#F4B400",
  "#7B68EE",
  "#FF6B35",
  "#2196F3",
  "#9C27B0",
];

function getLogoColor(company: string): string {
  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length];
}

function formatPostedDate(dateStr: string | null): string {
  if (!dateStr) return "Recently posted";
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000,
  );
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export default function BackendJobCard({ job }: { job: BackendJob }) {
  const [saved, setSaved] = useState(false);
  const logoColor = getLogoColor(job.company);
  const applyUrl = job.applyUrl || job.sourceUrl || "#";

  return (
    <Card className="p-6 border-[#e2eaf8] shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col h-full bg-white">
      {job.matchScore > 0 && (
        <div className="flex gap-1.5 px-5 pt-4 pb-0">
          <Badge
            variant="secondary"
            className="bg-green-50 text-green-700 hover:bg-green-100"
          >
            🎯 {job.matchScore}% Match
          </Badge>
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 pt-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 border"
              style={{
                backgroundColor: logoColor + "14",
                color: logoColor,
                borderColor: logoColor + "28",
              }}
            >
              {job.company[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3
                className="font-semibold text-[#0c1a3a] text-[15px] leading-snug mb-0.5 group-hover:text-primary transition-colors line-clamp-2"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                {job.title}
              </h3>
              <p className="text-[#7a92c1] text-sm">{job.company}</p>
            </div>
          </div>
          <Button
            onClick={() => setSaved(!saved)}
            className={`shrink-0 p-1.5 rounded-lg transition-all ${
              saved
                ? "text-primary bg-primary/20"
                : "text-white hover:text-primary hover:bg-primary/10"
            }`}
            aria-label="Save job"
          >
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </Button>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#7a92c1] mb-3">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-primary shrink-0" />
            <span className="truncate">{job.location || "Remote"}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-primary shrink-0" />
            {JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="tag">
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="tag">+{job.skills.length - 4}</span>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-[#f0f5ff]">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-primary font-bold text-sm">
                {job.salary || "Salary not disclosed"}
              </span>
              <p className="text-[#a8bcd8] text-xs mt-0.5">
                {formatPostedDate(job.postedAt)}
              </p>
            </div>
            <Button
              onClick={() =>
                window.open(applyUrl, "_blank", "noopener,noreferrer")
              }
              className="text-xs px-4 py-1.5 rounded-lg gap-1.5 h-auto bg-primary hover:bg-primary/90 text-white"
            >
              Apply <ExternalLink size={11} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
