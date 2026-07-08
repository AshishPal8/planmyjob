"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "info@findurjob.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Noida, Uttar Pradesh",
    sub: "India",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f0f5ff] pt-16">
      {/* Hero */}
      <section className="bg-white border-b border-[#e2eaf8] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-4xl font-bold text-[#0c1a3a] mb-4"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Contact Us
          </h1>
          <p className="text-[#7a92c1] text-lg">
            Have a question or need help? We would love to hear from you.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((c) => (
              <div
                key={c.label}
                className="bg-white border border-[#e2eaf8] rounded-2xl p-5 flex gap-4 items-start"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <c.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-[#7a92c1] mb-0.5">{c.label}</p>
                  <p className="font-semibold text-[#0c1a3a] text-sm">{c.value}</p>
                  <p className="text-xs text-[#7a92c1]">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-white border border-[#e2eaf8] rounded-2xl p-6">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 gap-3">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle size={28} className="text-primary" />
                </div>
                <h3 className="font-bold text-[#0c1a3a] text-lg">Message Sent!</h3>
                <p className="text-[#7a92c1] text-sm">
                  Thanks for reaching out. We will get back to you within 24 hours.
                </p>
                <Button
                  variant="outline"
                  className="rounded-xl mt-2"
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                >
                  Send Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-bold text-[#0c1a3a] text-lg mb-2">Send a Message</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#7a92c1] mb-1 block">Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-[#e2eaf8] rounded-xl px-4 py-2.5 text-sm text-[#0c1a3a] outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#7a92c1] mb-1 block">Email</label>
                    <input
                      required
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-[#e2eaf8] rounded-xl px-4 py-2.5 text-sm text-[#0c1a3a] outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#7a92c1] mb-1 block">Subject</label>
                  <input
                    required
                    type="text"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-[#e2eaf8] rounded-xl px-4 py-2.5 text-sm text-[#0c1a3a] outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#7a92c1] mb-1 block">Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Write your message here..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-[#e2eaf8] rounded-xl px-4 py-2.5 text-sm text-[#0c1a3a] outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <Button type="submit" className="w-full rounded-xl gap-2">
                  <Send size={15} />
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
