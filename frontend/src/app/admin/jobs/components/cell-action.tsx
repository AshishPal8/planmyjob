"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Edit,
  Trash,
  ExternalLink,
  Power,
  Star,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { toast } from "sonner";

interface CellActionProps {
  data: {
    id: number;
    title: string;
    slug: string;
    isActive: boolean;
    isFeatured: boolean;
  };
  onRefresh: () => void;
}

export function CellAction({ data, onRefresh }: CellActionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      const res = await api.patch(`/admin/jobs/${data.id}/status`);
      if (res.data?.success) {
        toast.success(res.data.message || "Job status updated");
        onRefresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update job status");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async () => {
    try {
      setLoading(true);
      const res = await api.patch(`/admin/jobs/${data.id}/featured`);
      if (res.data?.success) {
        toast.success(res.data.message || "Job featured status updated");
        onRefresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update featured status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${data.title}"?`)) return;

    try {
      setLoading(true);
      const res = await api.delete(`/admin/jobs/${data.id}`);
      if (res.data?.success) {
        toast.success("Job deleted successfully");
        onRefresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MoreHorizontal className="h-4 w-4" />
        )}
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">

        <DropdownMenuLabel>Job Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => router.push(`/admin/jobs/${data.id}`)}
          className="cursor-pointer"
        >

          <Edit className="mr-2 h-4 w-4 text-blue-500" />
          Edit Job Details
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => window.open(`/jobs/${data.slug}`, "_blank")}
          className="cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4 text-muted-foreground" />
          View Public Page
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleToggleStatus}
          className="cursor-pointer"
        >
          <Power
            className={`mr-2 h-4 w-4 ${
              data.isActive ? "text-amber-500" : "text-green-500"
            }`}
          />
          {data.isActive ? "Deactivate Job" : "Activate Job"}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleToggleFeatured}
          className="cursor-pointer"
        >
          <Star
            className={`mr-2 h-4 w-4 ${
              data.isFeatured ? "text-muted-foreground" : "text-amber-500 fill-amber-500"
            }`}
          />
          {data.isFeatured ? "Unmark Featured" : "Mark Featured"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDelete}
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Job
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
