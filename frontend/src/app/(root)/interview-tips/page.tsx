import { CheckCircle, Lightbulb, MessageSquare, Clock, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    icon: Lightbulb,
    title: "Before the Interview",
    color: "bg-primary/10 text-primary",
    tips: [
      "Research the company thoroughly — products, culture, recent news, and competitors.",
      "Study the job description and map your experience to each requirement.",
      "Prepare 5–7 STAR-format stories (Situation, Task, Action, Result).",
      "Practice answers to 'Tell me about yourself' — keep it under 2 minutes.",
      "Prepare 3–5 thoughtful questions to ask the interviewer.",
      "Test your tech setup a day before for video interviews.",
    ],
  },
  {
    icon: MessageSquare,
    title: "During the Interview",
    color: "bg-blue-50 text-blue-600",
    tips: [
      "Arrive 10 minutes early — or join the video call 2 minutes before.",
      "Listen carefully to every question before answering.",
      "Use the STAR method for behavioural questions.",
      "Be specific — real numbers and outcomes are far more convincing.",
      "If you don't know an answer, say how you would find it.",
      "Maintain good posture and steady eye contact.",
    ],
  },
  {
    icon: TrendingUp,
    title: "Salary Negotiation",
    color: "bg-amber-50 text-amber-600",
    tips: [
      "Always let the employer name a number first if possible.",
      "Research market rates on platforms like LinkedIn and Glassdoor.",
      "Negotiate the full package — not just base salary.",
      "Never accept on the spot; ask for 24–48 hours to consider.",
      "Be confident but collaborative — it is a conversation, not a battle.",
    ],
  },
  {
    icon: Clock,
    title: "After the Interview",
    color: "bg-purple-50 text-purple-600",
    tips: [
      "Send a thank-you email within 24 hours.",
      "Reference something specific from the conversation to stand out.",
      "Follow up politely if you haven't heard back in the stated timeline.",
      "Reflect on your answers and note what you'd improve.",
    ],
  },
];

const commonQuestions = [
  { q: "Tell me about yourself.", hint: "2-min summary: background → key wins → why this role." },
  { q: "Why do you want to work here?", hint: "Tie company mission to your own career goals." },
  { q: "What's your greatest weakness?", hint: "Real weakness + concrete steps you're taking to fix it." },
  { q: "Where do you see yourself in 5 years?", hint: "Show ambition that aligns with the role's growth path." },
  { q: "Why are you leaving your current job?", hint: "Stay positive — growth-seeking, not company-bashing." },
  { q: "Tell me about a challenge you overcame.", hint: "STAR format: clear situation, your actions, measurable result." },
];

export default function InterviewTipsPage() {
  return (
    <div className="min-h-screen bg-[#f0f5ff] pt-16">
      {/* Hero */}
      <section className="bg-white border-b border-[#e2eaf8] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-semibold mb-4">
            <Star size={12} />
            Career Resources
          </div>
          <h1
            className="text-4xl font-bold text-[#0c1a3a] mb-3"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Interview Tips
          </h1>
          <p className="text-[#7a92c1] text-lg">
            Practical advice to help you walk into every interview with confidence and walk out with an offer.
          </p>
        </div>
      </section>

      {/* Tips Sections */}
      <section className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {sections.map((sec) => (
          <div key={sec.title} className="bg-white border border-[#e2eaf8] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sec.color}`}>
                <sec.icon size={18} />
              </div>
              <h2
                className="text-lg font-bold text-[#0c1a3a]"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                {sec.title}
              </h2>
            </div>
            <ul className="space-y-3">
              {sec.tips.map((tip) => (
                <li key={tip} className="flex items-start gap-3 text-sm text-[#2d4070]">
                  <CheckCircle size={15} className="text-primary mt-0.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Common Questions */}
      <section className="max-w-5xl mx-auto px-4 pb-14">
        <h2
          className="text-2xl font-bold text-[#0c1a3a] mb-6"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Common Interview Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonQuestions.map((item) => (
            <div key={item.q} className="bg-white border border-[#e2eaf8] rounded-2xl p-5">
              <p className="font-semibold text-[#0c1a3a] text-sm mb-2">"{item.q}"</p>
              <p className="text-xs text-[#7a92c1] leading-relaxed">{item.hint}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 pb-14">
        <div className="bg-primary rounded-3xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
            Ready to find your next opportunity?
          </h2>
          <p className="text-white/70 mb-6 text-sm">
            Browse thousands of jobs matched to your skills.
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
