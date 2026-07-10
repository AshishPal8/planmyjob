"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackToJobsLink() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/jobs");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-1.5 text-[#7a92c1] hover:text-blue-600 text-sm transition-colors cursor-pointer"
    >
      <ArrowLeft size={14} /> Back to Jobs
    </button>
  );
}
