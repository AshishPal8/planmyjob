"use client";

import React, { useEffect, useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Users,
  Building2,
  FileText,
  Activity,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/axios";
import { toast } from "sonner";

interface StatsData {
  totalJobs: number;
  activeJobs: number;
  inactiveJobs: number;
  manualJobs: number;
  scrapedJobs: number;
  totalUsers: number;
  totalApplications: number;
  totalCompanies: number;
}

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/stats");
      if (res.data?.success) {
        setStats(res.data.data);
      }

    } catch (error: any) {
      console.error("Failed to fetch admin stats:", error);
      toast.error(error.response?.data?.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Heading
          title="SuperAdmin Dashboard"
          description="Platform overview, job postings metrics, and system controls."
        />
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
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
            Post New Job
          </Link>
        </div>
      </div>


      <Separator />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Jobs */}
        <Card className="border-border shadow-xs hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Jobs
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Briefcase className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "..." : (stats?.totalJobs ?? 0)}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> {stats?.activeJobs ?? 0} active
              </span>
              <span>•</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <XCircle className="h-3 w-3" /> {stats?.inactiveJobs ?? 0} inactive
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Manual vs Scraped */}
        <Card className="border-border shadow-xs hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Job Sources
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "..." : `${stats?.manualJobs ?? 0} Manual`}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <span>{stats?.scrapedJobs ?? 0} Automated / API scraped</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card className="border-border shadow-xs hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Users
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "..." : (stats?.totalUsers ?? 0)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <span>Candidates & platform members</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Applications & Companies */}
        <Card className="border-border shadow-xs hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Applications
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "..." : (stats?.totalApplications ?? 0)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <span>{stats?.totalCompanies ?? 0} Registered companies</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Banner */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-1">
          Quick Management Actions
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Quickly manage platform content, run job scrapers, or adjust settings.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/jobs/new"
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-foreground"
          >
            <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">Post Manual Job</div>
              <div className="text-xs text-muted-foreground">
                TipTap editor, ImageKit logo, skills
              </div>
            </div>
          </Link>

          <Link
            href="/admin/scrapers"
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-foreground"
          >
            <div className="h-9 w-9 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">Run Scrapers</div>
              <div className="text-xs text-muted-foreground">
                Trigger Remotive & JSearch sync
              </div>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-foreground"
          >
            <div className="h-9 w-9 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">Mailing & Settings</div>
              <div className="text-xs text-muted-foreground">
                Configure SMTP & platform controls
              </div>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}
