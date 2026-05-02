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

interface Props {
  open: boolean;
  onClose: () => void;
  onComplete: (skills: string[], experience: string) => void;
}

export default function ResumeUploadModal({
  open,
  onClose,
  onComplete,
}: Props) {
  const [step, setStep] = useState<"upload" | "parsing" | "done">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [skills] = useState([
    "React",
    "Node.js",
    "TypeScript",
    "Tailwind CSS",
    "Next.js",
    "MongoDB",
    "AWS",
    "Docker",
  ]);
  const [experience] = useState("4");
  const [score] = useState(82);
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
    setStep("parsing");
    setTimeout(() => setStep("done"), 2500);
  };

  const finish = () => {
    onComplete(skills, experience);
    onClose();
    router.push("/jobs?matched=true");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 max-w-lg overflow-hidden rounded-3xl">
        {/* Header */}
        <div className="bg-linear-to-br from-blue-700 to-blue-500 p-6 text-white">
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

        <div className="p-6">
          {/* Upload step */}
          {step === "upload" && (
            <>
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                  dragging
                    ? "border-blue-500 bg-blue-50"
                    : file
                      ? "border-blue-300 bg-blue-50/50"
                      : "border-border hover:border-blue-400 hover:bg-blue-50/30"
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!file}
                  onClick={upload}
                >
                  Analyse resume <ArrowRight size={15} />
                </Button>
              </div>
            </>
          )}

          {/* Parsing step */}
          {step === "parsing" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-blue-100">
                <Loader2 size={36} className="text-blue-600 animate-spin" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Analysing your resume...
              </h3>
              <p className="text-muted-foreground text-sm">
                Extracting skills, experience and matching to jobs
              </p>
              <div className="mt-6 space-y-2 text-left max-w-xs mx-auto">
                {[
                  "Reading resume content...",
                  "Extracting skills & experience...",
                  "Matching to job database...",
                ].map((msg, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Loader2 size={12} className="animate-spin text-blue-500" />{" "}
                    {msg}
                  </div>
                ))}
              </div>
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

              <p className="text-sm font-semibold mb-2.5">
                ✅ {skills.length} skills detected
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-100"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>

              <Alert className="mb-5 bg-green-50 border-green-100 text-green-700">
                <AlertDescription>
                  <p className="font-medium">
                    🎯 Found jobs matched to your profile
                  </p>
                  <p className="text-xs mt-0.5 text-green-600">
                    {experience}+ years experience detected
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
