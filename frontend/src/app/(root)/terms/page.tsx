import { FileText } from "lucide-react";

const sections = [
  {
    title: "Acceptance of Terms",
    body: `By accessing or using FindurJob, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time with reasonable notice.`,
  },
  {
    title: "Eligibility",
    body: `You must be at least 18 years old to use FindurJob. By using our platform, you confirm that you meet this age requirement and have the legal capacity to enter into a binding agreement.`,
  },
  {
    title: "Your Account",
    body: `You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, current, and complete information when registering. You must notify us immediately of any unauthorised use of your account. We reserve the right to suspend accounts that violate these terms.`,
  },
  {
    title: "Acceptable Use",
    body: `You agree not to: post false, misleading, or fraudulent information; use automated bots or scrapers to access our platform; harass, spam, or abuse other users or employers; attempt to gain unauthorised access to any part of the platform; or use our services for any unlawful purpose.`,
  },
  {
    title: "Job Listings & Applications",
    body: `FindurJob aggregates job listings from multiple sources. We do not guarantee the accuracy or availability of any listing. We are not responsible for the hiring decisions of employers. By applying to a job, you consent to sharing your profile and resume with that employer.`,
  },
  {
    title: "Resume & Content",
    body: `By uploading your resume or any content, you grant FindurJob a non-exclusive, royalty-free licence to use that content to provide our services, including AI-based job matching. You retain full ownership of your content. We will not share your resume without your explicit consent.`,
  },
  {
    title: "Intellectual Property",
    body: `All content, design, logos, and software on FindurJob are the property of FindurJob Technologies Pvt. Ltd. and protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.`,
  },
  {
    title: "Limitation of Liability",
    body: `FindurJob is provided "as is." We make no warranties regarding uninterrupted access or job placement outcomes. To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform.`,
  },
  {
    title: "Governing Law",
    body: `These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka. If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force.`,
  },
  {
    title: "Contact",
    body: `For questions about these Terms, please contact us at legal@findurjob.in or write to FindurJob Technologies Pvt. Ltd., Bengaluru, Karnataka, India.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f0f5ff] pt-16">
      {/* Hero */}
      <section className="bg-white border-b border-[#e2eaf8] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-semibold mb-4">
            <FileText size={12} />
            Legal
          </div>
          <h1
            className="text-4xl font-bold text-[#0c1a3a] mb-3"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Terms of Service
          </h1>
          <p className="text-[#7a92c1]">
            Last updated: June 2025 &nbsp;·&nbsp; Please read carefully before using FindurJob.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 text-sm text-primary font-medium">
          These Terms govern your use of FindurJob. By using our platform you agree to these terms in full.
        </div>

        {sections.map((s, i) => (
          <div key={s.title} className="bg-white border border-[#e2eaf8] rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div>
                <h2
                  className="font-bold text-[#0c1a3a] mb-2"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  {s.title}
                </h2>
                <p className="text-sm text-[#2d4070] leading-relaxed">{s.body}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
