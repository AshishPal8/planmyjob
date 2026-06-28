import Link from "next/link";
import { Briefcase, MapPin, Mail, Phone } from "lucide-react";

const columns = [
  {
    title: "For Job Seekers",
    links: [
      { label: "Find Jobs", href: "/jobs" },
      { label: "Recommended Jobs", href: "/recommended-jobs" },
      { label: "Match My Resume", href: "/match-resume" },
      { label: "Saved Jobs", href: "/saved-jobs" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Interview Tips", href: "/interview-tips" },
      { label: "Salary Guide", href: "/salary-guide" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0c1a3a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                <Briefcase size={15} className="text-white" />
              </div>
              <span
                className="text-xl font-bold"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                Findur<span className="text-primary">Job</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-5 max-w-xs">
              India&apos;s most trusted job search platform. Connecting
              ambitious professionals with their dream careers.
            </p>
            <div className="space-y-2 text-sm text-white/40">
              <div className="flex items-center gap-2">
                <Mail size={13} /> hello@findurjob.in
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} /> +91 98765 43210
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={13} /> Bengaluru, India
              </div>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4
                className="text-white text-sm font-semibold mb-4"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/40 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-white/10 mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-sm">
            © 2025 FindurJob Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-5">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white/30 text-sm hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
