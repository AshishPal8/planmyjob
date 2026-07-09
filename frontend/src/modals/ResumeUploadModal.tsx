"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  CheckCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/lib/axios";

interface Props {
  open: boolean;
  onClose: () => void;
  onComplete: (skills: string[], experience: number, title?: string) => void;
}

export default function ResumeUploadModal({
  open,
  onClose,
  onComplete,
}: Props) {
  const [step, setStep] = useState<"upload" | "uploading" | "done">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState(0);
  const [role, setRole] = useState("");
  const [summary, setSummary] = useState("");
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = (f: File) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|docx|txt)$/i)) {
      setError("Please upload a PDF, DOCX, or TXT file");
      return;
    }
    setFile(f);
    setError("");
  };

  const upload = async () => {
    if (!file) return;
    setStep("uploading");
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;
      if (!data.success || !data.data) {
        throw new Error("Invalid upload response");
      }

      const { skills: returnedSkills, currentTitle, experienceYears, summary: returnedSummary, isProcessed } = data.data;

      if (!isProcessed) {
        // File was saved, but AI parsing didn't succeed — don't pretend we
        // found 0 skills; let the user retry instead.
        setError(
          "We saved your resume but couldn't analyse it automatically. Please try uploading again.",
        );
        setStep("upload");
        return;
      }

      setSkills(Array.isArray(returnedSkills) ? returnedSkills : []);
      setRole(currentTitle || "Software Engineer");
      setExperience(typeof experienceYears === "number" ? experienceYears : 0);
      setSummary(returnedSummary || "");
      setScore(Math.min(100, 65 + (Array.isArray(returnedSkills) ? returnedSkills.length : 0)));

      onComplete(
        Array.isArray(returnedSkills) ? returnedSkills : [],
        typeof experienceYears === "number" ? experienceYears : 0,
        currentTitle,
      );

      // Small delay for UX transition
      await new Promise((resolve) => setTimeout(resolve, 900));
      setStep("done");
    } catch (err) {
      console.error(err);
      setError("Failed to upload resume. Please try again.");
      setStep("upload");
    }
  };

  const finish = () => {
    onComplete(skills, experience, role);
    onClose();
    const params = new URLSearchParams({ matched: "true" });
    if (skills.length > 0) params.set("skills", skills.join(","));
    if (role) params.set("title", role);
    router.push(`/jobs?${params}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 max-w-lg overflow-hidden rounded-3xl">
        {/* Header */}
        <div className="bg-linear-to-br from-primary to-primary/90 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} />
              <span className="text-sm font-medium">AI Resume Matching</span>
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              {step === "done" ? "Your jobs are ready!" : "Upload your resume"}
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-sm mt-1">
              {step === "done"
                ? `We found ${skills.length} skills and matched you to relevant jobs.`
                : "We'll instantly match you with jobs that fit your skills & experience."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(100vh-18rem)]">
          {/* Upload step */}
          {step === "upload" && (
            <>
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${dragging
                  ? "border-primary bg-primary/50"
                  : file
                    ? "border-blue-300 bg-primary/50"
                    : "border-border hover:border-primary hover:bg-primary/30"
                  }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleFile(f);
                }}
                onClick={() => inputRef.current?.click()}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFile(e.target.files[0])
                  }
                />
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <FileText size={28} className="text-blue-600" />
                    </div>
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {(file.size / 1024).toFixed(0)} KB · click to change
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border-2 border-blue-100">
                      <Upload size={28} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">
                        Drop your resume here
                      </p>
                      <p className="text-muted-foreground text-sm">
                        PDF, DOCX or TXT · max 10MB
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-1">
                      Browse file
                    </Button>
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive" className="mt-3">
                  <AlertCircle size={15} />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3 mt-5">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    onClose();
                    router.push("/jobs");
                  }}
                >
                  Skip for now
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/50"
                  disabled={!file}
                  onClick={upload}
                >
                  Analyse resume <ArrowRight size={15} />
                </Button>
              </div>
            </>
          )}

          {/* Uploading step */}
          {step === "uploading" && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-blue-100">
                <Loader2 size={36} className="text-blue-600 animate-spin" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Uploading your resume...
              </h3>
              <p className="text-muted-foreground text-sm">
                Securely sending your file to our servers
              </p>
            </div>
          )}

          {/* Done step */}
          {step === "done" && (
            <div>
              <div className="bg-blue-50 rounded-2xl p-5 mb-5 border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="font-semibold">Resume score</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {score}/100
                  </span>
                </div>
                <Progress value={score} className="h-2" />
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-500 mb-2">
                  Resume analysis results
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {role}
                    </p>
                    <p className="text-sm text-slate-600">
                      {experience} years experience
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-800">
                    {skills.length} skills detected
                  </div>
                </div>
              </div>

              <div className="mb-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-3 gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Skills extracted
                    </p>
                    <p className="text-xs text-slate-500">
                      Scroll to view all matched resume skills.
                    </p>
                  </div>
                </div>
                <div className="max-h-44 overflow-y-auto pr-1">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-white text-slate-800 border-slate-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {summary ? (
                <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900 mb-2">
                    Resume summary
                  </p>
                  <div className="max-h-36 overflow-y-auto text-sm text-slate-600 leading-6">
                    {summary}
                  </div>
                </div>
              ) : null}

              <Alert className="mb-5 bg-green-50 border-green-100 text-green-700">
                <AlertDescription>
                  <p className="font-medium">
                    🎯 Found jobs matched to your profile
                  </p>
                  <p className="text-xs mt-0.5 text-green-600">
                    Detected {role} with {experience} years experience
                  </p>
                </AlertDescription>
              </Alert>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={finish}
              >
                <Sparkles size={15} /> View my matched jobs
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
