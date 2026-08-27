"use client";
import { Search, MapPin, ArrowRight } from "lucide-react";
import AutocompleteInput from "@/components/ui/AutocompleteInput";
import { Button } from "@/components/ui/button";

interface JobSearchBarProps {
  skillsValue: string;
  onSkillsChange: (v: string) => void;
  locationValue: string;
  onLocationChange: (v: string) => void;
  onSearch: () => void;
  variant?: "home" | "jobs";
}

export default function JobSearchBar({
  skillsValue,
  onSkillsChange,
  locationValue,
  onLocationChange,
  onSearch,
  variant = "jobs",
}: JobSearchBarProps) {
  const isHome = variant === "home";

  const bar = (
    <div
      className={`rounded-2xl p-2 flex flex-col sm:flex-row gap-2 transition-all ${
        isHome
          ? "bg-card border border-border shadow-sm hover:border-primary/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
          : "bg-card border border-border shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
      }`}
    >
      <div className="flex-1 min-w-0">
        <AutocompleteInput
          value={skillsValue}
          onChange={onSkillsChange}
          endpoint="/search/skills"
          buildLabel={(item) => item.name}
          placeholder={
            isHome
              ? "Job title, skills (e.g. React, Python, DevOps)..."
              : "Skills (e.g. React, Node.js, AWS)..."
          }
          icon={<Search className="size-4 text-muted-foreground shrink-0" />}
          minChars={1}
        />
      </div>

      <div className="hidden sm:block w-px bg-border self-stretch my-1" />

      <div className="flex-1 min-w-0">
        <AutocompleteInput
          value={locationValue}
          onChange={onLocationChange}
          endpoint="/search/cities"
          buildLabel={(item) => item.name}
          buildSublabel={(item) => item.state}
          placeholder={isHome ? "City, country or 'Remote'..." : "City or Remote..."}
          icon={<MapPin className="size-4 text-muted-foreground shrink-0" />}
          minChars={2}
        />
      </div>

      {isHome ? (
        <Button
          type="submit"
          className="h-11 sm:h-auto px-6 rounded-xl font-semibold shrink-0 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Find Jobs</span>
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
          />
        </Button>
      ) : (
        <Button
          onClick={onSearch}
          className="h-10 px-5 rounded-xl font-semibold shrink-0 cursor-pointer"
        >
          Search
        </Button>
      )}
    </div>
  );

  if (isHome) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
        className="w-full"
      >
        {bar}
      </form>
    );
  }

  return bar;
}
