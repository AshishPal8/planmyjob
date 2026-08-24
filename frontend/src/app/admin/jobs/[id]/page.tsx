"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { JobForm, InitialJobData } from "../components/job-form";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [jobData, setJobData] = useState<InitialJobData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/jobs/${id}`);
        if (res.data?.success && res.data?.data) {
          const raw = res.data.data;
          setJobData({
            id: raw.id,
            title: raw.title || "",
            company: raw.company || "",
            companyId: raw.companyId,
            companyLogo: raw.companyLogo || "",
            companyDomain: raw.companyDomain || "",
            location: raw.location || "",
            workplaceType: raw.workplaceType || "remote",
            jobType: raw.jobType || "full_time",
            experienceLevel: raw.experienceLevel || "mid",
            category: raw.category || "",
            salary: raw.salary || "",
            minSalary: raw.minSalary,
            maxSalary: raw.maxSalary,
            salaryCurrency: raw.salaryCurrency || "USD",
            skills: Array.isArray(raw.skills) ? raw.skills : [],
            description: raw.description || "",
            applyUrl: raw.applyUrl || "",
            isFeatured: raw.isFeatured ?? false,
            isActive: raw.isActive ?? true,
            expiresAt: raw.expiresAt,
          });
        } else {
          toast.error("Job not found");
          router.push("/admin/jobs");
        }
      } catch (error: any) {
        console.error("Fetch job error:", error);
        toast.error(error.response?.data?.message || "Failed to load job post");
        router.push("/admin/jobs");
      } finally {

        setLoading(false);
      }
    };

    fetchJob();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm text-muted-foreground">Loading job details...</p>
      </div>
    );
  }

  if (!jobData) return null;

  return <JobForm initialData={jobData} />;
}
