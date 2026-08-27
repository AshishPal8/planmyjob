"use client";
import React from "react";
import Link from "next/link";
import {
  Briefcase,
  Home,
  Search,
  Send,
  Bookmark,
  Sparkles,
} from "lucide-react";
import DashboardSidebar from "@/components/layouts/DashboardSidebar";
import MobileFloatingTabBar, { type MobileTabItem } from "@/components/layouts/MobileFloatingTabBar";
import Logo from "@/components/layouts/Logo";

const profileNavItems: MobileTabItem[] = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Find Jobs", href: "/jobs", icon: Search },
  { label: "Applied", href: "/applications", icon: Send },
  { label: "Saved", href: "/saved-jobs", icon: Bookmark },
];

function MobileTopHeader() {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2eaf8] flex items-center justify-between px-4 h-14">
      <Link href="/" className="flex items-center gap-2">
        <Logo />
      </Link>
      <Link
        href="/ats-checker"
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20"
      >
        <Sparkles size={12} />
        <span>ATS Check</span>
      </Link>
    </header>
  );
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f0f5ff] flex flex-col lg:flex-row pb-20 lg:pb-0">
      <DashboardSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <MobileTopHeader />
        <main className="flex-1">{children}</main>
        <MobileFloatingTabBar items={profileNavItems} />
      </div>
    </div>
  );
}
