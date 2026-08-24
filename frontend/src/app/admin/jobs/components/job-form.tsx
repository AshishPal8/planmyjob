"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { JobDescriptionEditor } from "@/components/editor/tiptap-editor";
import { ImageUpload } from "@/components/editor/image-upload";
import { TagInput } from "@/components/ui/tag-input";
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Globe,
  Star,
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export interface InitialJobData {
  id?: number;
  title: string;
  company: string;
  companyId?: number | null;
  companyLogo?: string | null;
  companyDomain?: string | null;
  location: string;
  workplaceType: "remote" | "hybrid" | "on_site";
  jobType:
    | "full_time"
    | "part_time"
    | "contract"
    | "freelance"
    | "internship"
    | "remote";
  experienceLevel?: "entry" | "mid" | "senior" | "lead" | "executive" | null;
  category?: string | null;
  salary?: string | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  salaryCurrency?: string;
  skills: string[];
  description: string;
  applyUrl?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  expiresAt?: string | null;
}

interface JobFormProps {
  initialData?: InitialJobData | null;
}

export function JobForm({ initialData }: JobFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<InitialJobData>(
    initialData || {
      title: "",
      company: "",
      companyLogo: "",
      companyDomain: "",
      location: "Remote",
      workplaceType: "remote",
      jobType: "full_time",
      experienceLevel: "mid",
      category: "Software Engineering",
      salary: "",
      minSalary: null,
      maxSalary: null,
      salaryCurrency: "USD",
      skills: ["React", "TypeScript", "Node.js"],
      description: "",
      applyUrl: "",
      isFeatured: false,
      isActive: true,
      expiresAt: null,
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Job title is required");
      return;
    }

    if (!formData.company.trim()) {
      toast.error("Company name is required");
      return;
    }

    if (!formData.skills || formData.skills.length === 0) {
      toast.error("Please add at least one skill tag");
      return;
    }

    if (!formData.description || formData.description.length < 10) {
      toast.error("Job description must be at least 10 characters");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        minSalary: formData.minSalary ? Number(formData.minSalary) : null,
        maxSalary: formData.maxSalary ? Number(formData.maxSalary) : null,
      };

      if (isEditMode && initialData?.id) {
        const res = await api.put(`/admin/jobs/${initialData.id}`, payload);
        if (res.data?.success) {
          toast.success("Job posting updated successfully!");
          router.push("/admin/jobs");
          router.refresh();
        }
      } else {
        const res = await api.post("/admin/jobs", payload);
        if (res.data?.success) {
          toast.success("Job posting created successfully!");
          router.push("/admin/jobs");
          router.refresh();
        }
      }

    } catch (error: any) {
      console.error("Job submit error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to save job post",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/jobs"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
            )}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Heading

            title={isEditMode ? "Edit Job Posting" : "Post a New Job"}
            description={
              isEditMode
                ? `Update details for "${formData.title}"`
                : "Create a rich manual job posting with custom branding and skills."
            }
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/jobs")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="gap-2">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                {isEditMode ? "Save Changes" : "Publish Job"}
              </>
            )}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Section 1: Basic Information & Company */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-foreground font-bold text-base pb-2 border-b border-border">
          <Building2 className="h-5 w-5 text-primary" />
          <span>Job & Company Details</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Company Logo Upload */}
          <div className="space-y-2 flex flex-col items-center md:items-start">
            <Label>Company Logo</Label>
            <ImageUpload
              value={formData.companyLogo}
              onChange={(url) => setFormData({ ...formData, companyLogo: url })}
              label="Upload Logo"
            />
            <span className="text-[11px] text-muted-foreground text-center md:text-left">
              Recommended: 400x400 PNG or SVG
            </span>
          </div>

          {/* Title & Company Name */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                required
                placeholder="e.g. Senior Full Stack Engineer (Next.js & Node.js)"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  required
                  placeholder="e.g. Google, Stripe, TechNova"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyDomain">Company Domain / Website</Label>
                <Input
                  id="companyDomain"
                  placeholder="e.g. stripe.com"
                  value={formData.companyDomain || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, companyDomain: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location, Workplace, Job Type, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              required
              placeholder="e.g. Bangalore, India or Worldwide"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workplaceType">Workplace Type</Label>
            <select
              id="workplaceType"
              value={formData.workplaceType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  workplaceType: e.target.value as any,
                })
              }
              className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on_site">On-site</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobType">Employment Type</Label>
            <select
              id="jobType"
              value={formData.jobType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  jobType: e.target.value as any,
                })
              }
              className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote Only</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Experience Level</Label>
            <select
              id="experienceLevel"
              value={formData.experienceLevel || "mid"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  experienceLevel: e.target.value as any,
                })
              }
              className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
              <option value="lead">Lead / Staff</option>
              <option value="executive">Executive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Compensation & Links */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-foreground font-bold text-base pb-2 border-b border-border">
          <DollarSign className="h-5 w-5 text-primary" />
          <span>Compensation & Application Links</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="salary">Salary Display String</Label>
            <Input
              id="salary"
              placeholder="e.g. $120,000 - $150,000 / yr or ₹18 - 25 LPA"
              value={formData.salary || ""}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g. Software Engineering, Design, Product"
              value={formData.category || ""}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
          </div>

          <div className="space-y-2 md:col-span-4">
            <Label htmlFor="applyUrl">External Apply Link (Optional)</Label>
            <Input
              id="applyUrl"
              type="url"
              placeholder="e.g. https://careers.company.com/apply/123"
              value={formData.applyUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, applyUrl: e.target.value })
              }
            />
            <span className="text-[11px] text-muted-foreground">
              If provided, the "Apply Now" button will link to this URL.
            </span>
          </div>
        </div>
      </div>

      {/* Section 3: Skills & Tagging */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2 text-foreground font-bold text-base">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Required Skills & Tech Stack *</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formData.skills.length} skills added
          </span>
        </div>

        <div className="space-y-2">
          <TagInput
            value={formData.skills}
            onChange={(newSkills) =>
              setFormData({ ...formData, skills: newSkills })
            }
            placeholder="Type a skill (e.g. React, Docker, Python) and press Enter or Comma..."
          />
          <p className="text-xs text-muted-foreground">
            Candidates uploading resumes will be automatically matched against these skill tags using AI matching.
          </p>
        </div>
      </div>

      {/* Section 4: TipTap Rich Text Job Description */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2 text-foreground font-bold text-base">
            <Briefcase className="h-5 w-5 text-primary" />
            <span>Job Description & Requirements *</span>
          </div>
          <span className="text-xs text-muted-foreground">
            TipTap Rich Text (Use slash / for formatting)
          </span>
        </div>

        <div className="space-y-2">
          <JobDescriptionEditor
            value={formData.description}
            onChange={(html) =>
              setFormData({ ...formData, description: html })
            }
            placeholder="Write role responsibilities, required qualifications, benefits, and why candidates should join..."
          />
        </div>
      </div>

      {/* Section 5: Publishing & Visibility Controls */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-foreground font-bold text-base pb-2 border-b border-border">
          <Star className="h-5 w-5 text-primary" />
          <span>Publishing & Status Controls</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Active / Inactive Switch */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold">Active Listing</Label>
              <p className="text-xs text-muted-foreground">
                When active, the job appears on the public search and match feeds.
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
          </div>

          {/* Featured Listing Switch */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold">Featured Badge</Label>
              <p className="text-xs text-muted-foreground">
                Highlight this job at the top of homepage and job listing feeds.
              </p>
            </div>
            <Switch
              checked={formData.isFeatured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isFeatured: checked })
              }
            />
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/jobs")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          size="lg"
          className="gap-2 px-8"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              {isEditMode ? "Save Changes" : "Publish Job Post"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
