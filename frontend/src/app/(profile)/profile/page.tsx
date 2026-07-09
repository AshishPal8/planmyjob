"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Mail, Phone, Edit2, Plus, Trash2, Loader2,
  Globe, Link2, X, Code2, Users,
  Briefcase, GraduationCap, User as UserIcon, Sparkles, Upload,
  FileText, ExternalLink, AlertCircle, Bookmark, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore, type User, type WorkExperience, type Education } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { type BackendJob, formatPostedDate, getLogoColor } from "@/lib/jobs";

// ─── helpers ────────────────────────────────────────────────────────────────

function fmtDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

function profileCompletion(user: User | null) {
  if (!user) return 0;
  const checks = [
    !!user.headline,
    !!user.location,
    !!user.phone,
    !!user.about,
    (user.skills?.length ?? 0) > 0,
    (user.workExperiences?.length ?? 0) > 0,
    (user.educations?.length ?? 0) > 0,
    !!user.resumeUrl,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

// ─── tiny reusable input ────────────────────────────────────────────────────

function Field({
  label, value, onChange, type = "text", placeholder = "", textarea = false, rows = 3,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; textarea?: boolean; rows?: number;
}) {
  const cls = "w-full border border-[#e2eaf8] rounded-xl px-4 py-2.5 text-sm text-[#0c1a3a] outline-none focus:border-primary transition-colors bg-white";
  return (
    <div>
      <label className="text-xs font-semibold text-[#7a92c1] mb-1 block">{label}</label>
      {textarea
        ? <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${cls} resize-none`} />
        : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />}
    </div>
  );
}

// ─── section wrapper ────────────────────────────────────────────────────────

function Section({
  title, icon: Icon, onEdit, onAdd, children,
}: {
  title: string; icon: React.ElementType; onEdit?: () => void; onAdd?: () => void; children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#e2eaf8] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon size={15} className="text-primary" />
          </div>
          <h3 className="font-bold text-[#0c1a3a] text-sm" style={{ fontFamily: "Sora,sans-serif" }}>{title}</h3>
        </div>
        <div className="flex gap-2">
          {onAdd && (
            <button onClick={onAdd} className="w-7 h-7 rounded-lg border border-[#e2eaf8] flex items-center justify-center text-[#7a92c1] hover:text-primary hover:border-primary transition-colors">
              <Plus size={14} />
            </button>
          )}
          {onEdit && (
            <button onClick={onEdit} className="w-7 h-7 rounded-lg border border-[#e2eaf8] flex items-center justify-center text-[#7a92c1] hover:text-primary hover:border-primary transition-colors">
              <Edit2 size={13} />
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── modal wrapper ───────────────────────────────────────────────────────────

function Modal({ title, onClose, onSave, saving, children }: {
  title: string; onClose: () => void; onSave: () => void; saving?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2eaf8]">
          <h2 className="font-bold text-[#0c1a3a]" style={{ fontFamily: "Sora,sans-serif" }}>{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-[#e2eaf8] flex items-center justify-center text-[#7a92c1] hover:text-primary">
            <X size={15} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">{children}</div>
        <div className="px-6 pb-5 flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 rounded-xl gap-2" onClick={onSave} disabled={saving}>
            {saving && <Loader2 size={14} className="animate-spin" />} Save
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedJobs, setSavedJobs] = useState<BackendJob[]>([]);
  const [savedLoading, setSavedLoading] = useState(true);

  // modal states
  const [modal, setModal] = useState<
    null | "basic" | "about" | "skills" | "social" | "exp-add" | "exp-edit" | "edu-add" | "edu-edit" | "resume"
  >(null);

  // resume upload state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeStep, setResumeStep] = useState<"upload" | "uploading">("upload");
  const [resumeError, setResumeError] = useState("");
  const [resumeDragging, setResumeDragging] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // draft states
  const [draftBasic, setDraftBasic] = useState({ name: "", phone: "", location: "", headline: "", openToWork: false });
  const [draftAbout, setDraftAbout] = useState("");
  const [draftSkills, setDraftSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [draftSocial, setDraftSocial] = useState({ linkedinUrl: "", githubUrl: "", portfolioUrl: "" });
  const [draftExp, setDraftExp] = useState<WorkExperience>({ title: "", company: "", location: "", fromDate: "", toDate: null, isCurrent: false, description: "" });
  const [editExpIdx, setEditExpIdx] = useState<number | null>(null);
  const [draftEdu, setDraftEdu] = useState<Education>({ degreeTitle: "", university: "", location: "", fromDate: "", toDate: null, isCurrent: false, percentage: null });
  const [editEduIdx, setEditEduIdx] = useState<number | null>(null);

  // ── fetch profile ──
  useEffect(() => {
    api.get("/user/profile")
      .then((res) => {
        const data = res.data?.data ?? res.data;
        if (data) setUser({ ...(user ?? {}), ...data } as User);
      })
      .catch(() => {
        router.replace("/");
      })
      .finally(() => setLoading(false));

    api.get("/jobs/saved")
      .then((res) => setSavedJobs(res.data?.data ?? []))
      .catch(() => setSavedJobs([]))
      .finally(() => setSavedLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="text-primary animate-spin" />
    </div>
  );

  if (!user) return null;

  const completion = user.profileScore ?? profileCompletion(user);
  const isIncomplete = completion < 60;

  // ── save helper ──
  const saveProfile = async (patch: object) => {
    setSaving(true);
    try {
      const payload = {
        name: user.name,
        phone: user.phone ?? "",
        location: user.location ?? "",
        headline: user.headline ?? "",
        about: user.about ?? "",
        skills: user.skills ?? [],
        linkedinUrl: user.linkedinUrl ?? "",
        githubUrl: user.githubUrl ?? "",
        portfolioUrl: user.portfolioUrl ?? "",
        openToWork: user.openToWork ?? false,
        workExperiences: user.workExperiences ?? [],
        educations: user.educations ?? [],
        ...patch,
      };
      await api.put("/user/profile", payload);
      setUser({ ...user, ...patch });
      setModal(null);
      return true;
    } catch {
      toast.error("Failed to save. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ── open modal helpers ──
  const openBasic = () => {
    setDraftBasic({ name: user.name, phone: user.phone ?? "", location: user.location ?? "", headline: user.headline ?? "", openToWork: user.openToWork ?? false });
    setModal("basic");
  };
  const openAbout = () => { setDraftAbout(user.about ?? ""); setModal("about"); };
  const openSkills = () => { setDraftSkills([...(user.skills ?? [])]); setModal("skills"); };
  const openSocial = () => { setDraftSocial({ linkedinUrl: user.linkedinUrl ?? "", githubUrl: user.githubUrl ?? "", portfolioUrl: user.portfolioUrl ?? "" }); setModal("social"); };
  const openAddExp = () => { setDraftExp({ title: "", company: "", location: "", fromDate: "", toDate: null, isCurrent: false, description: "" }); setEditExpIdx(null); setModal("exp-add"); };
  const openEditExp = (i: number) => { setDraftExp({ ...(user.workExperiences![i]) }); setEditExpIdx(i); setModal("exp-edit"); };
  const openAddEdu = () => { setDraftEdu({ degreeTitle: "", university: "", location: "", fromDate: "", toDate: null, isCurrent: false, percentage: null }); setEditEduIdx(null); setModal("edu-add"); };
  const openEditEdu = (i: number) => { setDraftEdu({ ...(user.educations![i]) }); setEditEduIdx(i); setModal("edu-edit"); };
  const openResume = () => { setResumeFile(null); setResumeStep("upload"); setResumeError(""); setModal("resume"); };

  // ── save handlers ──
  const saveBasic = () => saveProfile(draftBasic);
  const saveAbout = () => saveProfile({ about: draftAbout });
  const saveSkills = () => saveProfile({ skills: draftSkills });
  const saveSocial = () => saveProfile(draftSocial);

  const saveExp = (isEdit: boolean) => {
    const exps = [...(user.workExperiences ?? [])];
    const entry = { ...draftExp, toDate: draftExp.isCurrent ? null : draftExp.toDate };
    if (isEdit && editExpIdx !== null) exps[editExpIdx] = entry;
    else exps.push(entry);
    saveProfile({ workExperiences: exps });
  };
  const deleteExp = (i: number) => {
    const exps = [...(user.workExperiences ?? [])];
    exps.splice(i, 1);
    saveProfile({ workExperiences: exps });
  };

  const saveEdu = (isEdit: boolean) => {
    const edus = [...(user.educations ?? [])];
    if (isEdit && editEduIdx !== null) edus[editEduIdx] = draftEdu;
    else edus.push(draftEdu);
    saveProfile({ educations: edus });
  };
  const deleteEdu = (i: number) => {
    const edus = [...(user.educations ?? [])];
    edus.splice(i, 1);
    saveProfile({ educations: edus });
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !draftSkills.includes(s)) setDraftSkills([...draftSkills, s]);
    setSkillInput("");
  };

  // ── resume upload ──
  const handleResumeFile = (f: File) => {
    const ok = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!ok.includes(f.type) && !f.name.match(/\.(pdf|docx)$/i)) {
      setResumeError("Please upload a PDF or DOCX file");
      return;
    }
    setResumeFile(f);
    setResumeError("");
  };

  const uploadResume = async () => {
    if (!resumeFile) return;
    setResumeStep("uploading");
    setResumeError("");
    try {
      const form = new FormData();
      form.append("file", resumeFile);
      const res = await api.post("/upload/file", form, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data?.data?.url;
      if (!url) throw new Error("Invalid response");
      const ok = await saveProfile({ resumeUrl: url });
      if (!ok) setResumeStep("upload");
    } catch {
      setResumeError("Upload failed. Please try again.");
      setResumeStep("upload");
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f5ff] lg:ml-64">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8">

        {/* Onboarding banner */}
        {isIncomplete && (
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                <Sparkles size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#0c1a3a] text-sm">Complete your profile ({completion}% done)</p>
                <p className="text-xs text-[#7a92c1] mt-0.5 leading-relaxed">A complete profile gets 5× more job matches. Add your headline, experience and skills.</p>
                <div className="mt-2 h-1.5 bg-[#e2eaf8] rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${completion}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-5">

            {/* Avatar + basic info */}
            <div className="bg-white border border-[#e2eaf8] rounded-2xl p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto">
                  {user.name[0]?.toUpperCase()}
                </div>
                {user.openToWork && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    Open to Work
                  </span>
                )}
              </div>
              <div className="mt-3">
                <h2 className="text-[#0c1a3a] text-lg font-bold" style={{ fontFamily: "Sora,sans-serif" }}>{user.name}</h2>
                {user.headline && <p className="text-primary text-sm font-medium mt-0.5">{user.headline}</p>}
                <div className="mt-3 space-y-1.5 text-xs text-[#7a92c1]">
                  {user.location && <div className="flex items-center justify-center gap-1"><MapPin size={11} />{user.location}</div>}
                  <div className="flex items-center justify-center gap-1"><Mail size={11} />{user.email}</div>
                  {user.phone && <div className="flex items-center justify-center gap-1"><Phone size={11} />{user.phone}</div>}
                </div>
              </div>
              <button onClick={openBasic} className="mt-4 w-full flex items-center justify-center gap-2 border border-[#e2eaf8] rounded-xl py-2 text-xs text-[#7a92c1] hover:text-primary hover:border-primary transition-colors">
                <Edit2 size={12} /> Edit Basic Info
              </button>

              {/* Profile strength */}
              <div className="mt-4 pt-4 border-t border-[#f0f5ff]">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#7a92c1]">Profile strength</span>
                  <span className="text-primary font-semibold">{completion}%</span>
                </div>
                <div className="h-1.5 bg-[#f0f5ff] rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${completion}%` }} />
                </div>
              </div>
            </div>

            {/* Skills */}
            <Section title="Skills" icon={Sparkles} onEdit={openSkills} onAdd={openSkills}>
              {(user.skills?.length ?? 0) === 0 ? (
                <button onClick={openSkills} className="w-full border-2 border-dashed border-[#e2eaf8] rounded-xl p-4 text-xs text-[#7a92c1] hover:border-primary hover:text-primary transition-colors">
                  + Add your skills
                </button>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {user.skills!.map((s) => (
                    <span key={s} className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              )}
            </Section>

            {/* Social Links */}
            <Section title="Social Links" icon={Link2} onEdit={openSocial}>
              <div className="space-y-2.5">
                {[
                  { icon: Users, label: "LinkedIn", val: user.linkedinUrl },
                  { icon: Code2, label: "GitHub", val: user.githubUrl },
                  { icon: Globe, label: "Portfolio", val: user.portfolioUrl },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className={`flex items-center gap-2.5 text-xs ${val ? "text-[#2d4070]" : "text-[#c7d7f5]"}`}>
                    <Icon size={14} className={val ? "text-primary" : "text-[#c7d7f5]"} />
                    {val ? (
                      <a href={val} target="_blank" rel="noreferrer" className="truncate hover:text-primary flex items-center gap-1">
                        {val.replace(/^https?:\/\//, "")} <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span>{label} not added</span>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            {/* Resume */}
            <Section title="Resume" icon={FileText} onEdit={openResume}>
              {user.resumeUrl ? (
                <div className="flex items-center gap-3 p-3 bg-[#f8fbff] border border-[#e2eaf8] rounded-xl">
                  <div className="w-9 h-9 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center text-red-500 text-[9px] font-bold">PDF</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#0c1a3a] text-xs font-medium truncate">Resume uploaded</p>
                    <a href={user.resumeUrl} target="_blank" rel="noreferrer" className="text-primary text-[10px] flex items-center gap-1">
                      View <ExternalLink size={9} />
                    </a>
                  </div>
                </div>
              ) : (
                <button onClick={openResume} className="w-full border-2 border-dashed border-[#e2eaf8] rounded-xl p-4 text-center hover:border-primary hover:text-primary transition-colors group">
                  <Upload size={18} className="text-[#c7d7f5] group-hover:text-primary mx-auto mb-1 transition-colors" />
                  <p className="text-xs text-[#7a92c1] group-hover:text-primary transition-colors">Click to upload resume</p>
                  <p className="text-[10px] text-[#c7d7f5] mt-0.5">PDF, DOCX or TXT · max 10MB</p>
                </button>
              )}
            </Section>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* About */}
            <Section title="About" icon={UserIcon} onEdit={openAbout}>
              {user.about ? (
                <p className="text-sm text-[#2d4070] leading-relaxed">{user.about}</p>
              ) : (
                <button onClick={openAbout} className="w-full border-2 border-dashed border-[#e2eaf8] rounded-xl p-4 text-xs text-[#7a92c1] hover:border-primary hover:text-primary transition-colors">
                  + Write a short summary about yourself
                </button>
              )}
            </Section>

            {/* Work Experience */}
            <Section title="Work Experience" icon={Briefcase} onAdd={openAddExp}>
              {(user.workExperiences?.length ?? 0) === 0 ? (
                <button onClick={openAddExp} className="w-full border-2 border-dashed border-[#e2eaf8] rounded-xl p-4 text-xs text-[#7a92c1] hover:border-primary hover:text-primary transition-colors">
                  + Add work experience
                </button>
              ) : (
                <div className="space-y-5">
                  {user.workExperiences!.map((exp, i) => (
                    <div key={i} className={i > 0 ? "pt-5 border-t border-[#f0f5ff]" : ""}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                            <Briefcase size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#0c1a3a] text-sm">{exp.title}</p>
                            <p className="text-primary text-xs font-medium">{exp.company}</p>
                            <p className="text-[#7a92c1] text-xs mt-0.5">
                              {fmtDate(exp.fromDate)} – {exp.isCurrent ? "Present" : fmtDate(exp.toDate)}
                              {exp.location && ` · ${exp.location}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button onClick={() => openEditExp(i)} className="w-7 h-7 rounded-lg border border-[#e2eaf8] flex items-center justify-center text-[#7a92c1] hover:text-primary">
                            <Edit2 size={12} />
                          </button>
                          <button onClick={() => deleteExp(i)} className="w-7 h-7 rounded-lg border border-[#e2eaf8] flex items-center justify-center text-[#7a92c1] hover:text-red-500">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      {exp.description && <p className="text-xs text-[#2d4070] mt-2 leading-relaxed ml-13 pl-0">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Education */}
            <Section title="Education" icon={GraduationCap} onAdd={openAddEdu}>
              {(user.educations?.length ?? 0) === 0 ? (
                <button onClick={openAddEdu} className="w-full border-2 border-dashed border-[#e2eaf8] rounded-xl p-4 text-xs text-[#7a92c1] hover:border-primary hover:text-primary transition-colors">
                  + Add education
                </button>
              ) : (
                <div className="space-y-5">
                  {user.educations!.map((edu, i) => (
                    <div key={i} className={i > 0 ? "pt-5 border-t border-[#f0f5ff]" : ""}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                            <GraduationCap size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#0c1a3a] text-sm">{edu.degreeTitle}</p>
                            <p className="text-primary text-xs font-medium">{edu.university}</p>
                            <p className="text-[#7a92c1] text-xs mt-0.5">
                              {fmtDate(edu.fromDate)} – {edu.isCurrent ? "Present" : fmtDate(edu.toDate)}
                              {edu.location && ` · ${edu.location}`}
                              {edu.percentage ? ` · ${edu.percentage}%` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button onClick={() => openEditEdu(i)} className="w-7 h-7 rounded-lg border border-[#e2eaf8] flex items-center justify-center text-[#7a92c1] hover:text-primary">
                            <Edit2 size={12} />
                          </button>
                          <button onClick={() => deleteEdu(i)} className="w-7 h-7 rounded-lg border border-[#e2eaf8] flex items-center justify-center text-[#7a92c1] hover:text-red-500">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Saved Jobs */}
            <div className="bg-white border border-[#e2eaf8] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Bookmark size={15} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-[#0c1a3a] text-sm" style={{ fontFamily: "Sora,sans-serif" }}>Saved Jobs</h3>
                </div>
                <Link href="/saved-jobs" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight size={11} />
                </Link>
              </div>

              {savedLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 size={20} className="text-primary animate-spin" />
                </div>
              ) : savedJobs.length === 0 ? (
                <Link href="/jobs" className="w-full block border-2 border-dashed border-[#e2eaf8] rounded-xl p-4 text-xs text-[#7a92c1] hover:border-primary hover:text-primary transition-colors text-center">
                  No saved jobs yet — browse jobs and bookmark the ones you like
                </Link>
              ) : (
                <div className="space-y-3">
                  {savedJobs.slice(0, 3).map((job) => {
                    const logoColor = getLogoColor(job.company);
                    return (
                      <Link
                        key={job.id}
                        href={`/jobs/${job.slug}`}
                        className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-[#f8fbff] transition-colors group"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border"
                          style={{
                            backgroundColor: logoColor + "14",
                            color: logoColor,
                            borderColor: logoColor + "28",
                          }}
                        >
                          {job.company[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[#0c1a3a] text-sm font-semibold truncate group-hover:text-primary transition-colors">
                            {job.title}
                          </p>
                          <p className="text-[#7a92c1] text-xs truncate">
                            {job.company} · {formatPostedDate(job.postedAt)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ════════════ MODALS ════════════ */}

      {/* Basic Info */}
      {modal === "basic" && (
        <Modal title="Edit Basic Info" onClose={() => setModal(null)} onSave={saveBasic} saving={saving}>
          <Field label="Full Name" value={draftBasic.name} onChange={(v) => setDraftBasic({ ...draftBasic, name: v })} />
          <Field label="Headline" value={draftBasic.headline} onChange={(v) => setDraftBasic({ ...draftBasic, headline: v })} placeholder="e.g. Full Stack Developer | React & Node.js" />
          <Field label="Phone" value={draftBasic.phone} onChange={(v) => setDraftBasic({ ...draftBasic, phone: v })} type="tel" placeholder="+91 98765 43210" />
          <Field label="Location" value={draftBasic.location} onChange={(v) => setDraftBasic({ ...draftBasic, location: v })} placeholder="City, State" />
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setDraftBasic({ ...draftBasic, openToWork: !draftBasic.openToWork })}
              className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${draftBasic.openToWork ? "bg-primary" : "bg-[#e2eaf8]"}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${draftBasic.openToWork ? "translate-x-4" : ""}`} />
            </div>
            <span className="text-sm text-[#2d4070] font-medium">Open to Work</span>
          </label>
        </Modal>
      )}

      {/* About */}
      {modal === "about" && (
        <Modal title="About Me" onClose={() => setModal(null)} onSave={saveAbout} saving={saving}>
          <Field label="Write about yourself" value={draftAbout} onChange={setDraftAbout} textarea rows={6}
            placeholder="Describe your background, expertise, and what you're looking for..." />
        </Modal>
      )}

      {/* Skills */}
      {modal === "skills" && (
        <Modal title="Edit Skills" onClose={() => setModal(null)} onSave={saveSkills} saving={saving}>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="Type a skill and press Enter"
              className="flex-1 border border-[#e2eaf8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <Button onClick={addSkill} className="rounded-xl px-4" size="sm">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {draftSkills.map((s) => (
              <span key={s} className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                {s}
                <button onClick={() => setDraftSkills(draftSkills.filter((x) => x !== s))} className="hover:text-red-500">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </Modal>
      )}

      {/* Social Links */}
      {modal === "social" && (
        <Modal title="Social Links" onClose={() => setModal(null)} onSave={saveSocial} saving={saving}>
          <Field label="LinkedIn URL" value={draftSocial.linkedinUrl} onChange={(v) => setDraftSocial({ ...draftSocial, linkedinUrl: v })} placeholder="https://linkedin.com/in/yourname" />
          <Field label="GitHub URL" value={draftSocial.githubUrl} onChange={(v) => setDraftSocial({ ...draftSocial, githubUrl: v })} placeholder="https://github.com/yourname" />
          <Field label="Portfolio URL" value={draftSocial.portfolioUrl} onChange={(v) => setDraftSocial({ ...draftSocial, portfolioUrl: v })} placeholder="https://yourname.dev" />
        </Modal>
      )}

      {/* Work Experience — Add / Edit */}
      {(modal === "exp-add" || modal === "exp-edit") && (
        <Modal
          title={modal === "exp-edit" ? "Edit Experience" : "Add Experience"}
          onClose={() => setModal(null)}
          onSave={() => saveExp(modal === "exp-edit")}
          saving={saving}
        >
          <Field label="Job Title" value={draftExp.title} onChange={(v) => setDraftExp({ ...draftExp, title: v })} placeholder="e.g. Senior Frontend Developer" />
          <Field label="Company" value={draftExp.company} onChange={(v) => setDraftExp({ ...draftExp, company: v })} placeholder="Company name" />
          <Field label="Location" value={draftExp.location} onChange={(v) => setDraftExp({ ...draftExp, location: v })} placeholder="City or Remote" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="From" value={draftExp.fromDate} onChange={(v) => setDraftExp({ ...draftExp, fromDate: v })} type="date" />
            {!draftExp.isCurrent && (
              <Field label="To" value={draftExp.toDate ?? ""} onChange={(v) => setDraftExp({ ...draftExp, toDate: v || null })} type="date" />
            )}
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={draftExp.isCurrent}
              onChange={(e) => setDraftExp({ ...draftExp, isCurrent: e.target.checked, toDate: e.target.checked ? null : draftExp.toDate })}
              className="accent-primary w-4 h-4 rounded" />
            <span className="text-sm text-[#2d4070]">Currently working here</span>
          </label>
          <Field label="Description" value={draftExp.description} onChange={(v) => setDraftExp({ ...draftExp, description: v })} textarea rows={3} placeholder="Describe your role and achievements..." />
        </Modal>
      )}

      {/* Education — Add / Edit */}
      {(modal === "edu-add" || modal === "edu-edit") && (
        <Modal
          title={modal === "edu-edit" ? "Edit Education" : "Add Education"}
          onClose={() => setModal(null)}
          onSave={() => saveEdu(modal === "edu-edit")}
          saving={saving}
        >
          <Field label="Degree / Course" value={draftEdu.degreeTitle} onChange={(v) => setDraftEdu({ ...draftEdu, degreeTitle: v })} placeholder="e.g. B.Tech in Computer Science" />
          <Field label="University / School" value={draftEdu.university} onChange={(v) => setDraftEdu({ ...draftEdu, university: v })} placeholder="University name" />
          <Field label="Location" value={draftEdu.location} onChange={(v) => setDraftEdu({ ...draftEdu, location: v })} placeholder="City, State" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="From" value={draftEdu.fromDate} onChange={(v) => setDraftEdu({ ...draftEdu, fromDate: v })} type="date" />
            {!draftEdu.isCurrent && (
              <Field label="To" value={draftEdu.toDate ?? ""} onChange={(v) => setDraftEdu({ ...draftEdu, toDate: v || null })} type="date" />
            )}
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={draftEdu.isCurrent}
              onChange={(e) => setDraftEdu({ ...draftEdu, isCurrent: e.target.checked })}
              className="accent-primary w-4 h-4 rounded" />
            <span className="text-sm text-[#2d4070]">Currently studying here</span>
          </label>
          <div>
            <label className="text-xs font-semibold text-[#7a92c1] mb-1 block">Percentage</label>
            <input
              type="number" step="0.1" min="0" max="100"
              value={draftEdu.percentage ?? ""}
              onChange={(e) => setDraftEdu({ ...draftEdu, percentage: e.target.value ? parseFloat(e.target.value) : null })}
              placeholder="e.g. 75.5"
              className="w-full border border-[#e2eaf8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
        </Modal>
      )}

      {/* Resume Upload */}
      {modal === "resume" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="bg-primary px-6 py-5 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-bold text-lg" style={{ fontFamily: "Sora,sans-serif" }}>
                    Upload your resume
                  </h2>
                  <p className="text-white/70 text-xs mt-0.5">
                    We&apos;ll save it to your profile
                  </p>
                </div>
                <button onClick={() => setModal(null)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30">
                  <X size={15} />
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Upload step */}
              {resumeStep === "upload" && (
                <>
                  <div
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                      resumeDragging ? "border-primary bg-primary/5" : resumeFile ? "border-primary/50 bg-primary/5" : "border-[#e2eaf8] hover:border-primary hover:bg-primary/5"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setResumeDragging(true); }}
                    onDragLeave={() => setResumeDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setResumeDragging(false); const f = e.dataTransfer.files[0]; if (f) handleResumeFile(f); }}
                    onClick={() => resumeInputRef.current?.click()}
                  >
                    <input ref={resumeInputRef} type="file" accept=".pdf,.docx" className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleResumeFile(e.target.files[0])} />
                    {resumeFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                          <FileText size={24} className="text-primary" />
                        </div>
                        <p className="font-semibold text-sm text-[#0c1a3a]">{resumeFile.name}</p>
                        <p className="text-[#7a92c1] text-xs">{(resumeFile.size / 1024).toFixed(0)} KB · click to change</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-[#f0f5ff] rounded-2xl flex items-center justify-center">
                          <Upload size={24} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#0c1a3a] text-sm">Drop your resume here</p>
                          <p className="text-[#7a92c1] text-xs mt-0.5">PDF or DOCX · max 10MB</p>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-xl mt-1">Browse file</Button>
                      </div>
                    )}
                  </div>
                  {resumeError && (
                    <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                      <AlertCircle size={13} /> {resumeError}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setModal(null)}>Cancel</Button>
                    <Button className="flex-1 rounded-xl" disabled={!resumeFile} onClick={uploadResume}>
                      Upload
                    </Button>
                  </div>
                </>
              )}

              {/* Uploading step */}
              {resumeStep === "uploading" && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 size={28} className="text-primary animate-spin" />
                  </div>
                  <p className="font-semibold text-[#0c1a3a]">Uploading your resume...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
