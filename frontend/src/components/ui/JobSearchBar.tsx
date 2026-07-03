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
      className={`border border-[#e2eaf8] rounded-2xl p-2 flex flex-col sm:flex-row gap-2 ${
        isHome ? "bg-white shadow-card-lg mb-4" : "bg-[#f8fbff]"
      }`}
    >
      <AutocompleteInput
        value={skillsValue}
        onChange={onSkillsChange}
        endpoint="/search/skills"
        buildLabel={(item) => item.name}
        placeholder={
          isHome
            ? "Skills (e.g. react, next.js, python)"
            : "Skills (e.g. react, python, aws)"
        }
        icon={<Search size={16} className="text-primary" />}
        minChars={1}
      />
      <div className="hidden sm:block w-px bg-[#e2eaf8] self-stretch my-1" />
      <AutocompleteInput
        value={locationValue}
        onChange={onLocationChange}
        endpoint="/search/cities"
        buildLabel={(item) => item.name}
        buildSublabel={(item) => item.state}
        placeholder={isHome ? "City, state or remote..." : "City or remote..."}
        icon={<MapPin size={16} className="text-primary" />}
        minChars={2}
      />
      {isHome ? (
        <Button type="submit">
          Search Jobs <ArrowRight size={15} />
        </Button>
      ) : (
        <Button onClick={onSearch}>Search</Button>
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
      >
        {bar}
      </form>
    );
  }

  return bar;
}
