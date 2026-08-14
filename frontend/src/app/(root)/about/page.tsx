import { Target, Users, Zap, Award } from "lucide-react";

const stats = [
  { value: "50K+", label: "Jobs Listed" },
  { value: "120K+", label: "Job Seekers" },
  { value: "8K+", label: "Companies" },
  { value: "95%", label: "Match Accuracy" },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "To connect talented professionals with the right opportunities using AI-driven matching that goes beyond keywords.",
  },
  {
    icon: Users,
    title: "People First",
    desc: "We believe every job seeker deserves a fair shot. Our platform is built to highlight potential, not just experience.",
  },
  {
    icon: Zap,
    title: "Powered by AI",
    desc: "Advanced machine learning analyses your resume and matches it to roles where you'll genuinely thrive.",
  },
  {
    icon: Award,
    title: "Trusted by Thousands",
    desc: "Over 120,000 professionals have found their next opportunity through PlanurJob since our founding.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f0f5ff] pt-16">
      {/* Hero */}
      <section className="bg-white border-b border-[#e2eaf8] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-4xl font-bold text-[#0c1a3a] mb-4"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            About <span className="text-primary">PlanurJob</span>
          </h1>
          <p className="text-[#7a92c1] text-lg leading-relaxed">
            We are on a mission to make job searching smarter, faster, and more
            human. PlanurJob uses AI to match your skills with the right roles —
            so you spend less time searching and more time interviewing.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-[#e2eaf8] rounded-2xl p-6 text-center"
            >
              <p
                className="text-3xl font-bold text-primary mb-1"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                {s.value}
              </p>
              <p className="text-sm text-[#7a92c1]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-4 pb-14">
        <h2
          className="text-2xl font-bold text-[#0c1a3a] text-center mb-8"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          What We Stand For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-white border border-[#e2eaf8] rounded-2xl p-6 flex gap-4"
            >
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <v.icon size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-[#0c1a3a] mb-1">{v.title}</h3>
                <p className="text-sm text-[#7a92c1] leading-relaxed">
                  {v.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="bg-white border-t border-[#e2eaf8] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl font-bold text-[#0c1a3a] mb-4"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Our Story
          </h2>
          <p className="text-[#7a92c1] leading-relaxed mb-4">
            PlanurJob was born out of frustration. Our founders spent months
            applying to hundreds of jobs, only to hear nothing back. The problem
            was not the candidates — it was the mismatch between skills and
            listings.
          </p>
          <p className="text-[#7a92c1] leading-relaxed">
            We built PlanurJob to solve that. By analysing resumes with AI and
            surfacing only the most relevant roles, we help job seekers work
            smarter — not harder. Today, we are proud to serve over 120,000
            professionals and growing every day.
          </p>
        </div>
      </section>
    </div>
  );
}
