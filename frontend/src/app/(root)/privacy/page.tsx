import { Shield } from "lucide-react";

const sections = [
  {
    title: "Information We Collect",
    body: `We collect information you provide directly, such as your name, email address, phone number, resume, and job preferences when you create an account or use our services. We also collect usage data automatically, including pages visited, searches made, and interactions with job listings.`,
  },
  {
    title: "How We Use Your Information",
    body: `Your information is used to match you with relevant job opportunities, personalise your experience, send you job alerts and updates you have opted into, improve our platform, and communicate service-related notices. We do not sell your personal data to third parties.`,
  },
  {
    title: "Sharing of Information",
    body: `We share your profile and resume only with employers you have explicitly applied to or matched with. We may share anonymised, aggregated data with partners for analytics purposes. We will disclose information when required by law or to protect the safety of our users.`,
  },
  {
    title: "Data Storage & Security",
    body: `Your data is stored on secure servers with industry-standard encryption (TLS/HTTPS). Access to personal data is restricted to authorised personnel only. We retain your data for as long as your account is active, or as required by law.`,
  },
  {
    title: "Cookies",
    body: `We use cookies and similar tracking technologies to remember your preferences, keep you signed in, and understand how you use our platform. You can control cookies through your browser settings, though some features may not work correctly without them.`,
  },
  {
    title: "Your Rights",
    body: `You have the right to access, correct, or delete your personal data at any time. You can update your profile in Account Settings, request a data export, or contact us to delete your account entirely. You may also opt out of marketing emails at any time.`,
  },
  {
    title: "Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. When we make significant changes, we will notify you via email or a prominent notice on the platform. Continued use of our services after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "Contact Us",
    body: `For any privacy-related questions or requests, please contact our Data Protection team at privacy@findurjob.in or write to us at FindurJob Technologies Pvt. Ltd., Bengaluru, Karnataka, India.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f0f5ff] pt-16">
      {/* Hero */}
      <section className="bg-white border-b border-[#e2eaf8] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-semibold mb-4">
            <Shield size={12} />
            Legal
          </div>
          <h1
            className="text-4xl font-bold text-[#0c1a3a] mb-3"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Privacy Policy
          </h1>
          <p className="text-[#7a92c1]">
            Last updated: June 2025 &nbsp;·&nbsp; Effective immediately
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 text-sm text-primary font-medium">
          Your privacy matters to us. This policy explains what data we collect, how we use it, and the choices you have.
        </div>

        {sections.map((s) => (
          <div key={s.title} className="bg-white border border-[#e2eaf8] rounded-2xl p-6">
            <h2
              className="font-bold text-[#0c1a3a] mb-3"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              {s.title}
            </h2>
            <p className="text-sm text-[#2d4070] leading-relaxed">{s.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
