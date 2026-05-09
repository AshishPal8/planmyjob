"use client";
import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Users,
  Eye,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  logoColor: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  tags: string[];
  featured?: boolean;
  urgent?: boolean;
  linkedinUrl: string;
  applicants?: number;
  views?: number;
}

export default function JobCard({
  job,
  saved = false,
  matchScore,
}: {
  job: Job;
  saved?: boolean;
  matchScore?: number;
}) {
  const [isSaved, setIsSaved] = useState(saved);

  const handleApply = () => {
    window.open(job.linkedinUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      className={`p-6 border-[#e2eaf8] shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col h-full ${job.featured ? "ring-1 ring-blue-200" : ""}`}
    >
      {/* Top badges row - absolutely placed above content */}
      {(job.featured || job.urgent || matchScore) && (
        <div className="flex flex-wrap gap-1.5 px-5 pt-4 pb-0">
          {matchScore && matchScore > 0 && (
            <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">🎯 {matchScore}% Match</Badge>
          )}
          {job.featured && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">⭐ Featured</Badge>
          )}
          {job.urgent && <Badge variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-100">⚡ Urgent</Badge>}
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 pt-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Company logo */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 border"
              style={{
                backgroundColor: job.logoColor + "14",
                color: job.logoColor,
                borderColor: job.logoColor + "28",
              }}
            >
              {job.logo}
            </div>
            {/* Title + company */}
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
          {/* Save button */}
          <Button
            onClick={() => setIsSaved(!isSaved)}
            className={`shrink-0 p-1.5 rounded-lg transition-all ${
              isSaved
                ? "text-primary bg-primary/20"
                : "text-[#a8bcd8] hover:text-primary hover:bg-primary/10"
            }`}
            aria-label="Save job"
          >
            {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </Button>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#7a92c1] mb-3">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-primary shrink-0" />
            <span className="truncate">{job.location}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-primary shrink-0" />
            {job.type}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
          {job.tags.length > 4 && (
            <span className="tag">+{job.tags.length - 4}</span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-[#f0f5ff]">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-primary font-bold text-sm">
                {job.salary}
              </span>
              <p className="text-[#a8bcd8] text-xs mt-0.5">{job.posted}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/jobs/${job.id}`}
                className="text-xs px-3 py-1.5 rounded-lg hover:bg-primary/20 hover:text-primary transition-colors"
              >
                Details
              </Link>
              <Button
                onClick={handleApply}
                className="text-xs px-4 py-1.5 rounded-lg gap-1.5 h-auto bg-primary hover:bg-primary/90 text-white"
              >
                Apply <ExternalLink size={11} />
              </Button>
            </div>
          </div>
          {/* Stats */}
          {(job.applicants || job.views) && (
            <div className="flex gap-4 mt-2">
              {job.applicants && (
                <span className="flex items-center gap-1 text-[10px] text-[#a8bcd8]">
                  <Users size={10} /> {job.applicants} applicants
                </span>
              )}
              {job.views && (
                <span className="flex items-center gap-1 text-[10px] text-[#a8bcd8]">
                  <Eye size={10} /> {job.views} views
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
