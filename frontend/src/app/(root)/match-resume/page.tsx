"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Upload,
  Target,
  BrainCircuit,
  Lock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ResumeUploadModal from "@/modals/ResumeUploadModal";

const features = [
  {
    icon: Upload,
    step: "01",
    title: "1-Click Resume Upload",
    desc: "Drop your PDF or DOCX resume. Zero signups or tedious forms required.",
  },
  {
    icon: BrainCircuit,
    step: "02",
    title: "AI Skill Extraction",
    desc: "Our AI engine extracts core technical skills, seniority level, and years of experience.",
  },
  {
    icon: Target,
    step: "03",
    title: "Ranked Match Feed",
    desc: "Receive an instant ranked list of active jobs filtered by AI compatibility score.",
  },
];

export default function MatchResumePage() {
  const [showResume, setShowResume] = useState(false);
  const router = useRouter();

  const handleComplete = (skills: string[], _experience: number, _title?: string) => {
    setShowResume(false);
    if (skills?.length > 0) {
      router.push(`/jobs?skills=${encodeURIComponent(skills.slice(0, 3).join(","))}`);
    } else {
      router.push("/jobs");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <ResumeUploadModal
        open={showResume}
        onClose={() => setShowResume(false)}
        onComplete={handleComplete}
      />

      {/* Hero Dropzone Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4 text-center">
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
            <Sparkles className="size-3.5 text-primary" />
            <span>AI-Powered Career Matching Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight mb-6">
            Match Your Resume to{" "}
            <span className="text-primary">
              10,000+ Active Roles
            </span>
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Stop scrolling through endless job boards. Upload your resume and let
            our AI find the exact positions that fit your background.
          </p>

          {/* Interactive Hero Dropzone Card */}
          <div
            onClick={() => setShowResume(true)}
            className="group relative max-w-2xl mx-auto rounded-3xl bg-card border-2 border-dashed border-border hover:border-primary p-8 sm:p-14 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-xs">
              <Upload className="size-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-foreground mb-2">
              Drop your resume here or click to browse
            </h3>
            <p className="text-muted-foreground text-sm mb-8">
              Supports PDF and DOCX documents up to 5MB
            </p>

            <Button
              size="lg"
              className="h-12 px-8 rounded-xl font-bold gap-2 cursor-pointer shadow-md shadow-primary/20"
            >
              <Sparkles className="size-4" />
              <span>Select File & Match Jobs</span>
            </Button>

            <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-border text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5">
                <Lock className="size-3.5" /> 100% Private & Secure
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="size-3.5 text-amber-500" /> Results in 5s
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Flow */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">
            How Resume Matching Works
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            No forms, no manual tagging. Our AI analyzes your actual accomplishments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-xs hover:border-primary/40 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <f.icon className="size-5" />
                  </div>
                  <span className="font-extrabold text-2xl text-muted-foreground/30">
                    {f.step}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl bg-primary text-primary-foreground p-8 sm:p-14 text-center shadow-xl shadow-primary/15">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 text-primary-foreground">
            Ready to Discover Your Next Job?
          </h2>
          <p className="text-primary-foreground/80 text-sm sm:text-base mb-8 max-w-md mx-auto">
            Join 50 Lakh+ professionals who matched their resume with PlanUrJob.
          </p>
          <Button
            onClick={() => setShowResume(true)}
            variant="secondary"
            className="h-12 px-8 rounded-xl font-bold shadow-md cursor-pointer text-sm"
          >
            <Upload className="size-4" />
            <span>Upload Resume Now</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
