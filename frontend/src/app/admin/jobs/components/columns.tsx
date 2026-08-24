"use client";

import React from "react";
import { ColumnConfig } from "@/components/ui/data-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import Image from "next/image";
import { Building2, Star, Sparkles } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export interface JobRow {
  id: number;
  title: string;
  slug: string;
  company: string;
  companyLogo?: string | null;
  location?: string | null;
  jobType?: string | null;
  workplaceType?: string | null;
  source: string;
  isFeatured: boolean;
  isActive: boolean;
  postedAt?: string | null;
  createdAt: string;
}

export const getJobColumns = (onRefresh: () => void): ColumnConfig[] => [
  {
    accessorKey: "title",
    header: "Job & Company",
    render: (row: Record<string, any>) => {
      const job = row as JobRow;
      return (
        <div className="flex items-center gap-3 py-1">
          <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden relative">
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={job.company}
                fill
                className="object-contain p-1"
              />
            ) : (
              <Building2 className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col min-w-0 max-w-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground truncate text-sm">
                {job.title}
              </span>
              {job.isFeatured && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Star className="h-2.5 w-2.5 fill-amber-500" /> Featured
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground truncate">
              {job.company}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    render: (row: Record<string, any>) => {
      const job = row as JobRow;
      return (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-foreground">
            {job.location || "Remote"}
          </span>
          <span className="text-[11px] text-muted-foreground capitalize">
            {job.workplaceType?.replace("_", " ") || "remote"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "jobType",
    header: "Type",
    render: (row: Record<string, any>) => {
      const job = row as JobRow;
      const typeLabel = job.jobType?.replace("_", " ") || "Full Time";
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-foreground capitalize border border-border">
          {typeLabel}
        </span>
      );
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    render: (row: Record<string, any>) => {
      const job = row as JobRow;
      const isManual = job.source === "manual";
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${
            isManual
              ? "bg-primary/10 text-primary border-primary/20 font-semibold"
              : "bg-muted text-muted-foreground border-border"
          }`}
        >
          {isManual && <Sparkles className="h-3 w-3" />}
          {job.source}
        </span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    render: (row: Record<string, any>) => {
      const job = row as JobRow;

      const handleQuickToggle = async (checked: boolean) => {
        try {
          const res = await api.patch(`/admin/jobs/${job.id}/status`);
          if (res.data?.success) {
            toast.success("Job status updated");
            onRefresh();
          }
        } catch (error: any) {
          toast.error(
            error.response?.data?.message || "Failed to toggle status",
          );
        }
      };

      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={job.isActive}
            onCheckedChange={handleQuickToggle}
          />
          <span
            className={`text-xs font-medium ${
              job.isActive ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
            }`}
          >
            {job.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Posted Date",
    render: (row: Record<string, any>) => {
      const job = row as JobRow;
      const dateVal = job.postedAt || job.createdAt;
      return (
        <span className="text-xs text-muted-foreground">
          {dateVal ? format(new Date(dateVal), "MMM dd, yyyy") : "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    className: "text-right w-12",
    render: (row: Record<string, any>) => {
      const job = row as JobRow;
      return <CellAction data={job} onRefresh={onRefresh} />;
    },
  },
];
