"use client";
import { useState } from "react";
import { CheckCircle2, ExternalLink } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuthAction } from "@/hooks/use-auth-action";
import api from "@/lib/axios";

export default function ApplyButton({
  applyUrl,
  jobId,
  label,
  appliedLabel = "Applied",
  isApplied,
  size,
  className,
}: {
  applyUrl: string;
  jobId: number;
  label: string;
  appliedLabel?: string;
  isApplied?: boolean;
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}) {
  const { execute } = useAuthAction();
  const [applied, setApplied] = useState(!!isApplied);

  const handleJobApply = async () => {
    execute(() => window.open(applyUrl, "_blank", "noopener,noreferrer"));

    setApplied(true);
    await api.post(`/jobs/apply/${jobId}`);
  };

  if (applied) {
    return (
      <Button
        size={size}
        disabled
        className={`bg-green-50 text-green-700 border border-green-200 cursor-default hover:bg-green-50 disabled:opacity-100 gap-1.5 ${className ?? ""}`}
      >
        <CheckCircle2 size={13} /> {appliedLabel}
      </Button>
    );
  }

  return (
    <Button size={size} className={className} onClick={handleJobApply}>
      {label} <ExternalLink size={13} />
    </Button>
  );
}
