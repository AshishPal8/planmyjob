"use client";

import React, { useEffect, useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  Mail,
  Sliders,
  CheckCircle2,
  Loader2,
  Shield,
  Send,
} from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingMailing, setSavingMailing] = useState(false);

  // General Settings
  const [general, setGeneral] = useState({
    siteName: "PlanMyJob",
    supportEmail: "support@planmyjob.com",
    seoTitle: "PlanMyJob — AI-Powered Job Matching & Career Portal",
    seoDescription:
      "Find top engineering, tech, and remote opportunities matched automatically to your resume skills with Google Gemini AI.",
    currency: "USD",
  });

  // Mailing Settings
  const [mailing, setMailing] = useState({
    provider: "resend", // or smtp
    resendApiKey: "",
    smtpHost: "smtp.sendgrid.net",
    smtpPort: "587",
    smtpUser: "apikey",
    smtpPassword: "",
    senderName: "PlanMyJob Team",
    fromEmail: "notifications@planmyjob.com",
    sendWelcomeEmail: true,
    sendJobAlerts: true,
    sendApplicationStatus: true,
  });

  // Feature Flags
  const [flags, setFlags] = useState({
    enablePublicRegistration: true,
    enableGeminiResumeParsing: true,
    enableAutomatedScrapers: true,
    enableEmployerSelfService: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/settings");
        if (res.data?.success && res.data?.data) {
          const s = res.data.data;
          if (s.general) setGeneral(s.general);
          if (s.mailing) setMailing(s.mailing);
          if (s.flags) setFlags(s.flags);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingGeneral(true);
      const res = await api.post("/admin/settings", {
        key: "general",
        value: general,
        description: "General Platform Settings",
      });
      if (res.data?.success) {
        toast.success("Platform settings saved successfully");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleSaveMailing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingMailing(true);
      const res = await api.post("/admin/settings", {
        key: "mailing",
        value: mailing,
        description: "Email & SMTP Configuration",
      });
      if (res.data?.success) {
        toast.success("Mailing configuration saved successfully");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to save mailing settings",
      );
    } finally {
      setSavingMailing(false);
    }
  };

  const handleSaveFlags = async (newFlags: typeof flags) => {
    setFlags(newFlags);
    try {
      const res = await api.post("/admin/settings", {
        key: "flags",
        value: newFlags,
        description: "System Feature Flags",
      });

      if (res.data?.success) {
        toast.success("Feature flags updated");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update flags");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <Heading
        title="Settings & System Configurations"
        description="Manage SuperAdmin platform settings, mailing/SMTP integrations, and system toggles."
      />
      <Separator />

      {/* Section 1: General Settings */}
      <form
        onSubmit={handleSaveGeneral}
        className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6"
      >
        <div className="flex items-center gap-2 text-foreground font-bold text-base pb-2 border-b border-border">
          <Settings className="h-5 w-5 text-primary" />
          <span>General Platform Settings</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site / Platform Name</Label>
            <Input
              id="siteName"
              value={general.siteName}
              onChange={(e) =>
                setGeneral({ ...general, siteName: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={general.supportEmail}
              onChange={(e) =>
                setGeneral({ ...general, supportEmail: e.target.value })
              }
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="seoTitle">Default SEO Title</Label>
            <Input
              id="seoTitle"
              value={general.seoTitle}
              onChange={(e) =>
                setGeneral({ ...general, seoTitle: e.target.value })
              }
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="seoDesc">Meta Description</Label>
            <Textarea
              id="seoDesc"
              rows={3}
              value={general.seoDescription}
              onChange={(e) =>
                setGeneral({ ...general, seoDescription: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={savingGeneral} className="gap-2">
            {savingGeneral && <Loader2 className="h-4 w-4 animate-spin" />}
            Save General Settings
          </Button>
        </div>
      </form>

      {/* Section 2: Mailing & SMTP Configuration */}
      <form
        onSubmit={handleSaveMailing}
        className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6"
      >
        <div className="flex items-center gap-2 text-foreground font-bold text-base pb-2 border-b border-border">
          <Mail className="h-5 w-5 text-primary" />
          <span>Mailing & Notification Service</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="senderName">Sender Name</Label>
            <Input
              id="senderName"
              placeholder="e.g. PlanMyJob Team"
              value={mailing.senderName}
              onChange={(e) =>
                setMailing({ ...mailing, senderName: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fromEmail">Sender From Email</Label>
            <Input
              id="fromEmail"
              type="email"
              placeholder="notifications@planmyjob.com"
              value={mailing.fromEmail}
              onChange={(e) =>
                setMailing({ ...mailing, fromEmail: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">Email Provider</Label>
            <select
              id="provider"
              value={mailing.provider}
              onChange={(e) =>
                setMailing({ ...mailing, provider: e.target.value })
              }
              className="w-full h-9 px-3 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="resend">Resend API</option>
              <option value="smtp">Custom SMTP Server</option>
            </select>
          </div>

          {mailing.provider === "resend" ? (
            <div className="space-y-2">
              <Label htmlFor="resendApiKey">Resend API Key</Label>
              <Input
                id="resendApiKey"
                type="password"
                placeholder="re_xxxxxxxxxxxx"
                value={mailing.resendApiKey}
                onChange={(e) =>
                  setMailing({ ...mailing, resendApiKey: e.target.value })
                }
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={mailing.smtpHost}
                  onChange={(e) =>
                    setMailing({ ...mailing, smtpHost: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  value={mailing.smtpPort}
                  onChange={(e) =>
                    setMailing({ ...mailing, smtpPort: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  value={mailing.smtpUser}
                  onChange={(e) =>
                    setMailing({ ...mailing, smtpUser: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPass">SMTP Password / API Key</Label>
                <Input
                  id="smtpPass"
                  type="password"
                  value={mailing.smtpPassword}
                  onChange={(e) =>
                    setMailing({ ...mailing, smtpPassword: e.target.value })
                  }
                />
              </div>
            </>
          )}
        </div>

        {/* Email Event Notification Toggles */}
        <div className="space-y-3 pt-2">
          <Label className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
            Automated Notification Toggles
          </Label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <span className="text-xs font-medium text-foreground">
                Welcome Emails
              </span>
              <Switch
                checked={mailing.sendWelcomeEmail}
                onCheckedChange={(val) =>
                  setMailing({ ...mailing, sendWelcomeEmail: val })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <span className="text-xs font-medium text-foreground">
                Daily Job Alerts
              </span>
              <Switch
                checked={mailing.sendJobAlerts}
                onCheckedChange={(val) =>
                  setMailing({ ...mailing, sendJobAlerts: val })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <span className="text-xs font-medium text-foreground">
                Application Updates
              </span>
              <Switch
                checked={mailing.sendApplicationStatus}
                onCheckedChange={(val) =>
                  setMailing({ ...mailing, sendApplicationStatus: val })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={savingMailing} className="gap-2">
            {savingMailing && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Mailing Configuration
          </Button>
        </div>
      </form>

      {/* Section 3: Feature Flags */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-foreground font-bold text-base pb-2 border-b border-border">
          <Sliders className="h-5 w-5 text-primary" />
          <span>System Feature Flags</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold">
                Gemini AI Resume Parsing
              </Label>
              <p className="text-xs text-muted-foreground">
                Automatically extract candidate skills & years of experience
              </p>
            </div>
            <Switch
              checked={flags.enableGeminiResumeParsing}
              onCheckedChange={(val) =>
                handleSaveFlags({ ...flags, enableGeminiResumeParsing: val })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold">
                Automated Scraper Crons
              </Label>
              <p className="text-xs text-muted-foreground">
                Enable daily 8 AM/PM Remotive & JSearch fetching
              </p>
            </div>
            <Switch
              checked={flags.enableAutomatedScrapers}
              onCheckedChange={(val) =>
                handleSaveFlags({ ...flags, enableAutomatedScrapers: val })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold">
                Employer Self-Service Portal
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow companies to post jobs and review applicant candidate
                profiles
              </p>
            </div>
            <Switch
              checked={flags.enableEmployerSelfService}
              onCheckedChange={(val) =>
                handleSaveFlags({ ...flags, enableEmployerSelfService: val })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold">
                Candidate Registrations
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow new job seekers to create accounts via Google OAuth
              </p>
            </div>
            <Switch
              checked={flags.enablePublicRegistration}
              onCheckedChange={(val) =>
                handleSaveFlags({ ...flags, enablePublicRegistration: val })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
