"use client";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function JobViewTracker({
  jobId,
  title,
  company,
}: {
  jobId: number;
  title: string;
  company: string;
}) {
  useEffect(() => {
    trackEvent("job_view", { job_id: jobId, job_title: title, company });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  return null;
}
