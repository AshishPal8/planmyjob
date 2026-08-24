"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataTable, { ColumnConfig } from "@/components/ui/data-table";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/editor/image-upload";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import Image from "next/image";
import { format } from "date-fns";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newCompany, setNewCompany] = useState({
    name: "",
    domain: "",
    website: "",
    logoUrl: "",
    industry: "Technology",
    companySize: "10-50",
    location: "Global",
    about: "",
    isVerified: true,
  });

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/companies", {
        params: { search: search || undefined },
      });
      if (res.data?.success) {
        setCompanies(res.data.data.items);
      }
    } catch (error: any) {
      console.error("Fetch companies error:", error);
      toast.error(error.response?.data?.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleToggleVerification = async (id: number) => {
    try {
      const res = await api.patch(`/admin/companies/${id}/verify`);
      if (res.data?.success) {
        toast.success(res.data.message);
        fetchCompanies();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update verification");
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name.trim()) {
      toast.error("Company name is required");
      return;
    }

    try {
      setCreating(true);
      const res = await api.post("/admin/companies", newCompany);
      if (res.data?.success) {
        toast.success("Company created successfully");
        setOpenModal(false);
        setNewCompany({
          name: "",
          domain: "",
          website: "",
          logoUrl: "",
          industry: "Technology",
          companySize: "10-50",
          location: "Global",
          about: "",
          isVerified: true,
        });
        fetchCompanies();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create company");
    } finally {
      setCreating(false);
    }
  };

  const columns: ColumnConfig[] = [
    {
      accessorKey: "name",
      header: "Company",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden relative">
            {row.logoUrl ? (
              <Image
                src={row.logoUrl}
                alt={row.name}
                fill
                className="object-contain p-1"
              />
            ) : (
              <Building2 className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              {row.name}
              {row.isVerified && (
                <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-500/20" />
              )}
            </span>
            <span className="text-xs text-muted-foreground">
              {row.domain || row.website || "No website"}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "industry",
      header: "Industry & Size",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-foreground">
            {row.industry || "General"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {row.companySize || "1-50 employees"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.location || "Remote / Global"}
        </span>
      ),
    },
    {
      accessorKey: "isVerified",
      header: "Verification",
      render: (row) => (
        <Button
          variant={row.isVerified ? "outline" : "secondary"}
          size="sm"
          onClick={() => handleToggleVerification(row.id)}
          className={`h-7 gap-1.5 text-xs ${
            row.isVerified
              ? "text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
              : "text-muted-foreground"
          }`}
        >
          {row.isVerified ? (
            <>
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </>
          ) : (
            <>
              <ShieldAlert className="h-3.5 w-3.5" />
              Unverified
            </>
          )}
        </Button>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Registered",
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.createdAt ? format(new Date(row.createdAt), "MMM dd, yyyy") : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Heading
          title={`Companies (${companies.length})`}
          description="Manage registered companies and employer brand profiles."
        />
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCompanies}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setOpenModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        </div>
      </div>

      <Separator />

      <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-xl max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search companies by name or domain..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0 p-0 h-7 text-sm"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-xl">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">Loading companies...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={companies}
          emptyMessage="No companies found."
        />
      )}

      {/* Add Company Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Company Profile</DialogTitle>
            <DialogDescription>
              Create a verified company profile for posting jobs and employer branding.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCompany} className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <ImageUpload
                value={newCompany.logoUrl}
                onChange={(url) => setNewCompany({ ...newCompany, logoUrl: url })}
                label="Logo"
              />
              <div className="flex-1 space-y-2">
                <Label htmlFor="cname">Company Name *</Label>
                <Input
                  id="cname"
                  required
                  placeholder="e.g. Acme Corp"
                  value={newCompany.name}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  placeholder="e.g. acme.com"
                  value={newCompany.domain}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, domain: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  placeholder="https://acme.com"
                  value={newCompany.website}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, website: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ind">Industry</Label>
                <Input
                  id="ind"
                  placeholder="e.g. SaaS, Fintech, AI"
                  value={newCompany.industry}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, industry: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="loc">Location</Label>
                <Input
                  id="loc"
                  placeholder="e.g. San Francisco, CA"
                  value={newCompany.location}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, location: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating} className="gap-2">
                {creating && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Company
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
