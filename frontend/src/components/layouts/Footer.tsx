import Link from "next/link";
import { Briefcase, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0c1a3a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <Briefcase size={15} className="text-white" />
              </div>
              <span
                className="text-xl font-bold"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                Findur<span className="text-primary">Job</span>
              </span>
            </Link>
            <p className="text-blue-100/50 text-sm leading-relaxed mb-5 max-w-xs">
              India&apos;s most trusted job search platform. Connecting
              ambitious professionals with their dream careers.
            </p>
            {/* <div className="flex gap-2.5 mb-6">
              {[Twitter, Linkedin, Instagram, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-200/50 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div> */}
            <div className="space-y-2 text-sm text-blue-100/40">
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

          {/* Links */}
          {[
            {
              title: "For Job Seekers",
              links: [
                "Browse Jobs",
                "Companies",
                "Salary Guide",
                "Resume Builder",
                "Career Blog",
                "Job Alerts",
              ],
            },
            {
              title: "For Employers",
              links: [
                "Post a Job",
                "Browse Profiles",
                "Pricing",
                "Recruiter Tools",
                "Campus Hiring",
              ],
            },
            {
              title: "Resources",
              links: [
                "Interview Tips",
                "Career Advice",
                "Skill Tests",
                "Certifications",
                "Community",
              ],
            },
            {
              title: "Company",
              links: [
                "About Us",
                "Careers",
                "Press",
                "Contact",
                "Privacy Policy",
                "Terms",
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4
                className="text-white text-sm font-semibold mb-4"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-blue-100/40 text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App badges */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            ["📱 App Store", "iOS"],
            ["🤖 Google Play", "Android"],
          ].map(([label, platform]) => (
            <a
              key={platform}
              href="#"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
            >
              <span className="text-white text-sm font-medium">{label}</span>
            </a>
          ))}
        </div>

        <hr className="border-white/8 mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-blue-100/30 text-sm">
            © 2025 FindurJob Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Cookies", "Accessibility"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-blue-100/30 text-sm hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
