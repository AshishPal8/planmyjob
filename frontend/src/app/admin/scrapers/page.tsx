"use client";

import React, { useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Play, CheckCircle, RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export default function ScrapersPage() {
  const [runningRemotive, setRunningRemotive] = useState(false);
  const [runningJSearch, setRunningJSearch] = useState(false);
  const [remotiveStatus, setRemotiveStatus] = useState<string | null>(null);
  const [jsearchStatus, setJsearchStatus] = useState<string | null>(null);

  const handleTriggerRemotive = async () => {
    try {
      setRunningRemotive(true);
      setRemotiveStatus("Fetching jobs from Remotive API...");
      const res = await api.post("/admin/scrapers/remotive");
      if (res.data?.success) {
        toast.success(
          `Remotive sync completed: Fetched ${res.data.fetched}, Saved ${res.data.saved} new jobs`,
        );
        setRemotiveStatus(
          `Success: Fetched ${res.data.fetched}, Saved ${res.data.saved} new jobs`,
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Remotive sync failed");
      setRemotiveStatus("Failed: " + (error.response?.data?.message || "Error"));
    } finally {
      setRunningRemotive(false);
    }
  };

  const handleTriggerJSearch = async () => {
    try {
      setRunningJSearch(true);
      setJsearchStatus("Fetching jobs from JSearch RapidAPI...");
      const res = await api.post("/admin/scrapers/jsearch");
      if (res.data?.success) {
        toast.success(
          `JSearch sync completed: Fetched ${res.data.fetched}, Saved ${res.data.saved} new jobs`,
        );
        setJsearchStatus(
          `Success: Fetched ${res.data.fetched}, Saved ${res.data.saved} new jobs`,
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "JSearch sync failed");
      setJsearchStatus("Failed: " + (error.response?.data?.message || "Error"));
    } finally {
      setRunningJSearch(false);
    }
  };

  return (
    <div className="space-y-6">
      <Heading
        title="Scrapers & Automated Sync"
        description="Monitor automated scraper cron jobs and manually trigger on-demand job ingestion."
      />
      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Remotive Scraper Card */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Remotive API Scraper
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Scrapes remote software development, devops, product, design, and data jobs.
              </p>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
              Active Cron
            </span>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="text-xs space-y-1.5 text-muted-foreground">
              <div className="flex justify-between py-1 border-b border-border">
                <span>Auto Schedule:</span>
                <span className="font-medium text-foreground">8:00 AM & 8:00 PM Daily</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span>Categories:</span>
                <span className="font-medium text-foreground">7 Tech Categories</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span>Deduplication:</span>
                <span className="font-medium text-foreground">Unique sourceId tracking</span>
              </div>
            </div>

            {remotiveStatus && (
              <div className="p-3 rounded-lg bg-muted text-xs font-mono text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary animate-pulse shrink-0" />
                <span>{remotiveStatus}</span>
              </div>
            )}

            <Button
              onClick={handleTriggerRemotive}
              disabled={runningRemotive}
              className="w-full gap-2"
            >
              <Play className={`h-4 w-4 ${runningRemotive ? "animate-spin" : ""}`} />
              {runningRemotive ? "Running Remotive Scraper..." : "Trigger Remotive Scraper Now"}
            </Button>
          </CardContent>
        </Card>

        {/* JSearch Scraper Card */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" /> JSearch RapidAPI Scraper
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Scrapes fresh engineering listings across Indian & global markets.
              </p>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
              Active Cron
            </span>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="text-xs space-y-1.5 text-muted-foreground">
              <div className="flex justify-between py-1 border-b border-border">
                <span>Auto Schedule:</span>
                <span className="font-medium text-foreground">8:00 AM & 8:00 PM Daily</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span>Query:</span>
                <span className="font-medium text-foreground">Software Engineer India / Global</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span>Rate Limit Protection:</span>
                <span className="font-medium text-foreground">RapidAPI Managed</span>
              </div>
            </div>

            {jsearchStatus && (
              <div className="p-3 rounded-lg bg-muted text-xs font-mono text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500 animate-pulse shrink-0" />
                <span>{jsearchStatus}</span>
              </div>
            )}

            <Button
              onClick={handleTriggerJSearch}
              disabled={runningJSearch}
              variant="outline"
              className="w-full gap-2 border-blue-500/30 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400"
            >
              <Play className={`h-4 w-4 ${runningJSearch ? "animate-spin" : ""}`} />
              {runningJSearch ? "Running JSearch Scraper..." : "Trigger JSearch Scraper Now"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Auto Deactivation Notice */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">Automated 30-Day Cleanup Policy</p>
          <p>
            Jobs older than 30 days are automatically marked as inactive at 8:00 PM daily by the background cron to ensure candidate feeds stay fresh and relevant.
          </p>
        </div>
      </div>
    </div>
  );
}
