import { TrendingUp, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";

const roles = [
  { title: "Frontend Developer", range: "₹6L – ₹30L", avg: "₹14L", growth: "+18%", category: "Engineering" },
  { title: "Backend Developer", range: "₹7L – ₹35L", avg: "₹16L", growth: "+20%", category: "Engineering" },
  { title: "Full Stack Engineer", range: "₹10L – ₹45L", avg: "₹22L", growth: "+22%", category: "Engineering" },
  { title: "Data Scientist", range: "₹10L – ₹50L", avg: "₹24L", growth: "+25%", category: "Data" },
  { title: "ML Engineer", range: "₹12L – ₹60L", avg: "₹30L", growth: "+30%", category: "Data" },
  { title: "DevOps Engineer", range: "₹8L – ₹40L", avg: "₹20L", growth: "+19%", category: "Engineering" },
  { title: "Product Manager", range: "₹12L – ₹60L", avg: "₹28L", growth: "+15%", category: "Product" },
  { title: "UI/UX Designer", range: "₹5L – ₹25L", avg: "₹12L", growth: "+14%", category: "Design" },
  { title: "Growth Marketer", range: "₹5L – ₹22L", avg: "₹11L", growth: "+12%", category: "Marketing" },
  { title: "Android Developer", range: "₹6L – ₹32L", avg: "₹15L", growth: "+16%", category: "Engineering" },
  { title: "iOS Developer", range: "₹7L – ₹35L", avg: "₹17L", growth: "+17%", category: "Engineering" },
  { title: "Cloud Architect", range: "₹18L – ₹80L", avg: "₹40L", growth: "+28%", category: "Engineering" },
];

const cities = [
  { city: "Bengaluru", premium: "+35%", desc: "India's tech capital — highest salaries for engineering roles." },
  { city: "Mumbai", premium: "+20%", desc: "Finance, media, and product roles dominate the market." },
  { city: "Hyderabad", premium: "+18%", desc: "Fast-growing IT hub with strong MNC presence." },
  { city: "Pune", premium: "+12%", desc: "Strong in engineering, automotive tech, and fintech." },
  { city: "Delhi NCR", premium: "+15%", desc: "Government, enterprise tech, and e-commerce roles." },
  { city: "Remote", premium: "+0%", desc: "Base rates apply but growing in popularity post-2020." },
];

const tips = [
  "Always research the role on LinkedIn Salary and Glassdoor before negotiating.",
  "Senior titles typically command 40–60% more than mid-level for the same function.",
  "Stock options (ESOPs) can add 20–100% to your effective package at funded startups.",
  "Location matters — Bengaluru roles pay up to 35% more than Tier 2 cities.",
  "Switching jobs typically yields a 20–40% bump vs. internal increments of 10–15%.",
];

export default function SalaryGuidePage() {
  return (
    <div className="min-h-screen bg-[#f0f5ff] pt-16">
      {/* Hero */}
      <section className="bg-white border-b border-[#e2eaf8] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-semibold mb-4">
            <TrendingUp size={12} />
            2025 Salary Data
          </div>
          <h1
            className="text-4xl font-bold text-[#0c1a3a] mb-3"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            India Tech Salary Guide
          </h1>
          <p className="text-[#7a92c1] text-lg">
            Real salary ranges across popular roles and cities — so you always know your worth.
          </p>
        </div>
      </section>

      {/* Salary Table */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2
          className="text-xl font-bold text-[#0c1a3a] mb-5"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Salary by Role
        </h2>
        <div className="bg-white border border-[#e2eaf8] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-4 px-5 py-3 bg-[#f8fbff] border-b border-[#e2eaf8] text-xs font-semibold text-[#7a92c1] uppercase tracking-wide">
            <span>Role</span>
            <span>Range (CTC)</span>
            <span>Average</span>
            <span>YoY Growth</span>
          </div>
          {roles.map((r, i) => (
            <div
              key={r.title}
              className={`grid grid-cols-4 px-5 py-4 text-sm items-center ${i !== roles.length - 1 ? "border-b border-[#f0f5ff]" : ""}`}
            >
              <div>
                <p className="font-semibold text-[#0c1a3a]">{r.title}</p>
                <span className="text-[10px] bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                  {r.category}
                </span>
              </div>
              <span className="text-[#2d4070]">{r.range}</span>
              <span className="font-semibold text-[#0c1a3a]">{r.avg}</span>
              <span className="text-primary font-semibold">{r.growth}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#7a92c1] mt-2 px-1">
          * Data based on Indian job market trends (2025). Figures are approximate.
        </p>
      </section>

      {/* City Premium */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <h2
          className="text-xl font-bold text-[#0c1a3a] mb-5"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          City Salary Premium
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cities.map((c) => (
            <div key={c.city} className="bg-white border border-[#e2eaf8] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-primary" />
                <span className="font-bold text-[#0c1a3a]">{c.city}</span>
                <span className="ml-auto text-primary font-semibold text-sm">{c.premium}</span>
              </div>
              <p className="text-xs text-[#7a92c1] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Negotiation Tips */}
      <section className="max-w-5xl mx-auto px-4 pb-14">
        <div className="bg-white border border-[#e2eaf8] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <Briefcase size={16} className="text-primary" />
            </div>
            <h2 className="font-bold text-[#0c1a3a]">Negotiation Tips</h2>
          </div>
          <ul className="space-y-3">
            {tips.map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-[#2d4070]">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 pb-14">
        <div className="bg-primary rounded-3xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
            Know your worth — now find the job.
          </h2>
          <p className="text-white/70 mb-6 text-sm">
            Browse roles that match your skills and experience level.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-2.5 rounded-xl text-sm"
          >
            Browse Jobs
          </Link>
        </div>
      </section>
    </div>
  );
}
