"use client";
import { useState } from "react";
import {
  MapPin,
  Mail,
  Edit,
  Plus,
  Trash2,
  Loader2,
  Upload,
} from "lucide-react";
import ResumeUploadModal from "@/modals/ResumeUploadModal";
import { useAuthStore } from "@/store/auth-store";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const { user, setUser } = useAuthStore();

  if (!user)
    return (
      <div className="min-h-screen bg-[#f0f5ff] flex items-center justify-center">
        <Loader2 size={32} className="text-blue-600 animate-spin" />
      </div>
    );

  // const completion = user ? 88 : 62;

  return (
    <>
      <ResumeUploadModal
        open={showResume}
        onClose={() => setShowResume(false)}
        onComplete={(skills, exp) => {
          setUser({
            ...user,
          });
          setShowResume(false);
        }}
      />

      <main className="min-h-screen bg-[#f0f5ff] flex-1 lg:ml-64 p-6 lg:p-3">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-2xl font-bold text-[#0c1a3a]"
            style={{ fontFamily: "Sora,sans-serif" }}
          >
            My Profile
          </h1>
          <button
            onClick={() => setEditing(!editing)}
            className={
              editing
                ? "btn-primary px-5 py-2.5 rounded-xl text-sm"
                : "btn-secondary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
            }
          >
            {editing ? (
              "Save Changes"
            ) : (
              <>
                <Edit size={13} /> Edit Profile
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-5">
            {/* Avatar */}
            <div className="bg-white border border-[#e2eaf8] rounded-2xl p-6 text-center shadow-card">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user.name[0]}
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-md">
                  <Edit size={12} />
                </button>
              </div>
              <h2
                className="text-[#0c1a3a] text-xl font-bold mb-1"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                {user.name}
              </h2>
              <p className="text-blue-600 text-sm font-medium mb-3">
                Full Stack Developer
              </p>
              <div className="space-y-1.5 text-sm text-[#7a92c1]">
                <div className="flex items-center justify-center gap-1.5">
                  <MapPin size={12} className="text-blue-500" />
                  Bengaluru, India
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <Mail size={12} className="text-blue-500" />
                  {user.email}
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-[#f0f5ff]">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#7a92c1]">Profile strength</span>
                  {/* <span className="text-blue-600 font-semibold">
                    {completion}%
                  </span> */}
                </div>
                <div className="progress-bar">
                  {/* <div
                    className="progress-fill"
                    style={{ width: `${completion}%` }}
                  /> */}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white border border-[#e2eaf8] rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="font-semibold text-[#0c1a3a] text-sm"
                  style={{ fontFamily: "Sora,sans-serif" }}
                >
                  Skills
                </h3>
                <button className="text-blue-600 hover:text-blue-700">
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["React", "Node.js", "TypeScript", "Python", "AWS"].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 badge badge-blue text-xs"
                    >
                      {skill}
                      {editing && (
                        <button className="hover:text-red-500 ml-0.5">
                          <Trash2 size={9} />
                        </button>
                      )}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* Resume */}
            <div className="bg-white border border-[#e2eaf8] rounded-2xl p-5 shadow-card">
              <h3
                className="font-semibold text-[#0c1a3a] text-sm mb-4"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                Resume
              </h3>

              <div className="flex items-center gap-3 p-3 bg-[#f0f5ff] rounded-xl border border-[#e2eaf8]">
                <div className="w-9 h-9 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center text-red-500 text-[10px] font-bold">
                  PDF
                </div>
                <div className="flex-1">
                  <p className="text-[#0c1a3a] text-xs font-medium">
                    Resume.pdf
                  </p>
                  <p className="text-[#7a92c1] text-[10px]">
                    Analysed · {1} skills found
                  </p>
                </div>
                <button
                  onClick={() => setShowResume(true)}
                  className="text-blue-600 text-xs hover:underline"
                >
                  Update
                </button>
              </div>

              <button
                onClick={() => setShowResume(true)}
                className="w-full border-2 border-dashed border-[#c7d7f5] rounded-xl p-4 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all"
              >
                <Upload size={20} className="text-blue-400 mx-auto mb-2" />
                <p className="text-[#7a92c1] text-xs">Click to upload resume</p>
              </button>
            </div>
          </div>

          {/* Right columns */}
          <div className="lg:col-span-2 space-y-5">
            {/* About */}
            <div className="bg-white border border-[#e2eaf8] rounded-2xl p-6 shadow-card">
              <h3
                className="font-bold text-[#0c1a3a] mb-4 text-sm"
                style={{ fontFamily: "Sora,sans-serif" }}
              >
                About Me
              </h3>
              {editing ? (
                <textarea
                  rows={4}
                  defaultValue="Passionate full stack developer with 4 years of experience building scalable web applications."
                  className="input p-3 rounded-xl text-sm resize-none"
                />
              ) : (
                <p className="text-[#2d4070] text-sm leading-relaxed">
                  Passionate full stack developer with 4 years of experience
                  building scalable web applications. Experienced with React,
                  Node.js, and cloud technologies.
                </p>
              )}
            </div>

            {/* Experience */}
            <div className="bg-white border border-[#e2eaf8] rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-5">
                <h3
                  className="font-bold text-[#0c1a3a] text-sm"
                  style={{ fontFamily: "Sora,sans-serif" }}
                >
                  Work Experience
                </h3>
                <button className="flex items-center gap-1 text-blue-600 text-xs hover:underline">
                  <Plus size={12} /> Add
                </button>
              </div>
              <div className="space-y-5">
                {[
                  {
                    role: "Senior Frontend Developer",
                    co: "TechCorp India",
                    dur: "Jan 2022 – Present",
                    desc: "Led development of core product features using React and TypeScript. Improved team productivity by 30%.",
                  },
                  {
                    role: "Full Stack Developer",
                    co: "StartupXYZ",
                    dur: "Mar 2020 – Dec 2021",
                    desc: "Built end-to-end features for a SaaS platform serving 50K+ users.",
                  },
                ].map((exp, i) => (
                  <div
                    key={i}
                    className={i > 0 ? "pt-5 border-t border-[#f0f5ff]" : ""}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-[#0c1a3a] font-semibold text-sm">
                          {exp.role}
                        </h4>
                        <p className="text-blue-600 text-xs font-medium mt-0.5">
                          {exp.co}
                        </p>
                        <p className="text-[#7a92c1] text-xs mt-1">{exp.dur}</p>
                      </div>
                      {editing && (
                        <button className="text-[#7a92c1] hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="text-[#2d4070] text-sm mt-2 leading-relaxed">
                      {exp.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white border border-[#e2eaf8] rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="font-bold text-[#0c1a3a] text-sm"
                  style={{ fontFamily: "Sora,sans-serif" }}
                >
                  Education
                </h3>
                <button className="flex items-center gap-1 text-blue-600 text-xs hover:underline">
                  <Plus size={12} /> Add
                </button>
              </div>
              <h4 className="text-[#0c1a3a] font-semibold text-sm">
                B.Tech in Computer Science
              </h4>
              <p className="text-blue-600 text-xs font-medium mt-0.5">
                IIT Bengaluru
              </p>
              <p className="text-[#7a92c1] text-xs mt-1">
                2016 – 2020 · CGPA: 8.5/10
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
