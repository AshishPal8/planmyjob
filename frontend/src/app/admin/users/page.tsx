"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import DataTable, { ColumnConfig } from "@/components/ui/data-table";
import {
  Users,
  Search,
  RefreshCw,
  Shield,
  ShieldCheck,
  Briefcase,
  User as UserIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import Image from "next/image";
import { format } from "date-fns";
import { useDebounceValue } from "@/hooks/use-debounce-value";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounceValue(search, 400);
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users", {
        params: {
          page,
          pageSize: 10,
          search: debouncedSearch || undefined,
          role: roleFilter !== "all" ? roleFilter : undefined,
        },
      });

      if (res.data?.success) {
        setUsers(res.data.data.items);
        setTotalPages(res.data.data.pagination.totalPages || 1);
        setTotalUsers(res.data.data.pagination.total || 0);
      }
    } catch (error: any) {
      console.error("Fetch users error:", error);
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/role`, {
        role: newRole,
      });
      if (res.data?.success) {
        toast.success("User role updated successfully");
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleToggleStatus = async (userId: number) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/status`);
      if (res.data?.success) {
        toast.success(res.data.message || "User status updated");
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update user status",
      );
    }
  };

  const columns: ColumnConfig[] = [
    {
      accessorKey: "name",
      header: "User Details",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm overflow-hidden relative shrink-0">
            {row.profilePicture ? (
              <Image
                src={row.profilePicture}
                alt={row.name}
                fill
                className="object-cover"
              />
            ) : (
              row.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-foreground text-sm truncate">
              {row.name}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {row.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Platform Role",
      render: (row) => (
        <select
          value={row.role || "job_seeker"}
          onChange={(e) => handleRoleChange(row.id, e.target.value)}
          className="h-8 px-2.5 bg-background border border-input rounded-lg text-xs font-semibold capitalize text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="job_seeker">Job Seeker</option>
          <option value="employer">Employer</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Account Status",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.isActive}
            onCheckedChange={() => handleToggleStatus(row.id)}
          />
          <span
            className={`text-xs font-medium ${
              row.isActive ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
            }`}
          >
            {row.isActive ? "Active" : "Suspended"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined Date",
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
          title={`Users & Permissions (${totalUsers})`}
          description="Manage candidates, employers, admins, and SuperAdmin role assignments."
        />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Separator />

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border p-3.5 rounded-xl shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-9"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 bg-background border border-input rounded-lg text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Roles</option>
          <option value="job_seeker">Job Seekers</option>
          <option value="employer">Employers</option>
          <option value="admin">Admins</option>
          <option value="superadmin">Superadmins</option>
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-xl">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">Loading users...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={users}
            emptyMessage="No users found."
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 pt-2">
              <div className="text-xs text-muted-foreground">
                Showing Page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{totalPages}</span> ({totalUsers} users)
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
