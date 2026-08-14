"use client";
import { useState } from "react";
import { Sparkles, Upload, CheckCircle, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResumeUploadModal from "@/modals/ResumeUploadModal";

const features = [
  {
    icon: Upload,
    title: "Upload Your Resume",
    desc: "Upload your PDF or Word resume and let our AI analyse your skills, experience, and strengths.",
  },
  {
    icon: Target,
    title: "AI Skill Matching",
    desc: "Our AI extracts key skills from your resume and matches them against thousands of live job listings.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    desc: "Get a ranked list of the best-matching jobs in seconds, tailored specifically to your background.",
  },
];

export default function MatchResumePage() {
  const [showResume, setShowResume] = useState(false);
  const [matched, setMatched] = useState(false);

  const handleComplete = () => {
    setShowResume(false);
    setMatched(true);
  };

  return (
    <div className="min-h-screen bg-[#f0f5ff] pt-16">
      {/* Hero */}
      <section className="bg-white border-b border-[#e2eaf8] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <Sparkles size={14} />
            Smart Resume Matching
          </div>
          <h1
            className="text-4xl font-bold text-[#0c1a3a] mb-4"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Match My Resume to Jobs
          </h1>
          <p className="text-[#7a92c1] text-lg mb-8">
            Upload your resume and instantly discover jobs that match your
            skills and experience with AI-powered precision.
          </p>

          {matched ? (
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-2xl px-6 py-3 font-semibold text-sm">
              <CheckCircle size={18} />
              Resume analysed! Check your Recommended Jobs.
            </div>
          ) : (
            <Button
              size="lg"
              className="rounded-xl gap-2 px-8"
              onClick={() => setShowResume(true)}
            >
              <Upload size={16} />
              Upload My Resume
            </Button>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <h2
          className="text-2xl font-bold text-[#0c1a3a] text-center mb-10"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-white border border-[#e2eaf8] rounded-2xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <f.icon size={22} className="text-primary" />
              </div>
              <div className="w-6 h-6 bg-primary rounded-full text-white text-xs font-bold flex items-center justify-center mx-auto mb-3">
                {i + 1}
              </div>
              <h3 className="font-bold text-[#0c1a3a] mb-2">{f.title}</h3>
              <p className="text-sm text-[#7a92c1] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 pb-14">
        <div className="bg-primary rounded-3xl p-10 text-center text-white">
          <h2
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Ready to find your perfect job match?
          </h2>
          <p className="text-primary-foreground/80 mb-6">
            Join thousands of job seekers who found their dream role with
            PlanurJob.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="rounded-xl gap-2"
            onClick={() => setShowResume(true)}
          >
            <Upload size={16} />
            Upload Resume Now
          </Button>
        </div>
      </section>

      <ResumeUploadModal
        open={showResume}
        onClose={() => setShowResume(false)}
        onComplete={handleComplete}
      />
    </div>
  );
}
