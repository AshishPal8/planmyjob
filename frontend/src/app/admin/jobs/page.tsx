"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import DataTable from "@/components/ui/data-table";
import { getJobColumns } from "./components/columns";
import {
  PlusCircle,
  Search,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useDebounceValue } from "@/hooks/use-debounce-value";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounceValue(search, 400);

  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/jobs", {
        params: {
          page,
          pageSize: 10,
          search: debouncedSearch || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          source: sourceFilter !== "all" ? sourceFilter : undefined,
        },
      });

      if (res.data?.success) {
        setJobs(res.data.data.items);
        setTotalPages(res.data.data.pagination.totalPages || 1);
        setTotalJobs(res.data.data.pagination.total || 0);
      }
    } catch (error: any) {
      console.error("Failed to fetch admin jobs:", error);
      toast.error(error.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, sourceFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const columns = getJobColumns(fetchJobs);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Heading
          title={`Job Management (${totalJobs})`}
          description="Create manual jobs, review active/inactive status, and manage listings."
        />
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchJobs}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link
            href="/admin/jobs/new"
            className={cn(buttonVariants({ size: "sm" }), "gap-2")}
          >
            <PlusCircle className="h-4 w-4" />
            Post Manual Job
          </Link>

        </div>
      </div>


      <Separator />

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card border border-border p-3.5 rounded-xl shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title, company, or skills..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 px-3 py-1 bg-background border border-input rounded-lg text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 px-3 py-1 bg-background border border-input rounded-lg text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Sources</option>
            <option value="manual">Manual Posts</option>
            <option value="remotive">Remotive Scraper</option>
            <option value="jsearch">JSearch API</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-3" />
          <p className="text-sm text-muted-foreground">Loading job postings...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={jobs}
            emptyMessage="No job posts found matching your criteria."
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 pt-2">
              <div className="text-xs text-muted-foreground">
                Showing Page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{totalPages}</span> ({totalJobs} jobs)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="gap-1 text-xs"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="gap-1 text-xs"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
