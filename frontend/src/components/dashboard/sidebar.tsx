"use client";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

import {
  Briefcase,
  Users,
  Building2,
  Sliders,
  Settings,
  Activity,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  PlusCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export const adminRoutes = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Jobs",
    icon: Briefcase,
    href: "/admin/jobs",
  },
  {
    label: "Post a Job",
    icon: PlusCircle,
    href: "/admin/jobs/new",
  },
  {
    label: "Companies",
    icon: Building2,
    href: "/admin/companies",
  },
  {
    label: "Users & Roles",
    icon: Users,
    href: "/admin/users",
  },
  {
    label: "Scrapers & Sync",
    icon: Activity,
    href: "/admin/scrapers",
  },
  {
    label: "Settings & Mail",
    icon: Settings,
    href: "/admin/settings",
  },
];

export function DashSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully");
    } catch {
      // ignore
    } finally {
      logout();
      router.push("/");
    }
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen sticky top-0 bg-card border-r border-border transition-all duration-300 z-30",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-border flex items-center justify-between">
        {!isCollapsed ? (
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight leading-none text-foreground">
                PlanMyJob
              </span>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider mt-0.5">
                Admin Panel
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/admin" className="mx-auto">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              <Sparkles className="h-4 w-4" />
            </div>
          </Link>
        )}

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-muted-foreground hover:text-foreground"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Routes */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {adminRoutes.map((route) => {
          const isActive =
            pathname === route.href ||
            (route.href !== "/admin" && pathname.startsWith(route.href));

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                buttonVariants({
                  variant: isActive ? "secondary" : "ghost",
                  size: isCollapsed ? "icon" : "default",
                }),
                "w-full transition-colors",
                isCollapsed ? "justify-center" : "justify-start px-3",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold hover:bg-primary/90 hover:text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80",
              )}
              title={isCollapsed ? route.label : undefined}
            >
              <route.icon
                className={cn("h-4 w-4 shrink-0", !isCollapsed && "mr-3")}
              />
              {!isCollapsed && <span className="text-sm">{route.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Footer / User Profile & Logout */}
      <div className="p-3 border-t border-border space-y-2">
        {!isCollapsed && user && (
          <div className="px-3 py-2 rounded-lg bg-muted/40 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs">
              {user.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-foreground truncate">
                {user.name}
              </span>
              <span className="text-[10px] text-muted-foreground truncate uppercase font-medium">
                {user.role || "Admin"}
              </span>
            </div>
          </div>
        )}

        <Link
          href="/"
          target="_blank"
          className={cn(
            buttonVariants({
              variant: "outline",
              size: isCollapsed ? "icon" : "default",
            }),
            "w-full text-xs text-muted-foreground hover:text-foreground",
            isCollapsed ? "justify-center" : "justify-start px-3",
          )}
          title={isCollapsed ? "View Live Site" : undefined}
        >
          <ExternalLink
            className={cn("h-4 w-4 shrink-0", !isCollapsed && "mr-3")}
          />
          {!isCollapsed && <span>View Live Site</span>}
        </Link>

        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          className={cn(
            "w-full text-destructive hover:bg-destructive/10 hover:text-destructive",
            isCollapsed ? "justify-center" : "justify-start px-3",
          )}
          title={isCollapsed ? "Logout" : undefined}
          onClick={handleLogout}
        >
          <LogOut className={cn("h-4 w-4 shrink-0", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>Log Out</span>}
        </Button>
      </div>
    </aside>
  );
}
