"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, Menu, X, Home, Search, User, Bookmark, LogOut } from "lucide-react";
import DashboardSidebar from "@/components/layouts/DashboardSidebar";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/axios";

function MobileTopBar() {
  const [open, setOpen] = useState(false);
  const { user, logout: clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    clearAuth();
    router.push("/");
  };

  const navLinks = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Find Jobs", href: "/jobs" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Bookmark, label: "Saved Jobs", href: "/saved-jobs" },
  ];

  return (
    <header className="lg:hidden sticky top-0 z-50 bg-white border-b border-[#e2eaf8] flex items-center justify-between px-4 h-14">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 bg-primary rounded-xl flex items-center justify-center">
          <Briefcase size={13} className="text-white" />
        </div>
        <span className="font-bold text-base text-[#0c1a3a]" style={{ fontFamily: "Sora,sans-serif" }}>
          Findur<span className="text-primary">Job</span>
        </span>
      </Link>

      <button onClick={() => setOpen(!open)} className="p-2 text-[#2d4070] rounded-lg hover:bg-primary/10">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 top-14 bg-black/30 z-40" onClick={() => setOpen(false)} />
          <div className="fixed top-14 left-0 right-0 bg-white border-b border-[#e2eaf8] z-50 px-4 py-3 space-y-1">
            {user && (
              <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-[#f8fbff] rounded-2xl">
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#0c1a3a] truncate">{user.name}</p>
                  <p className="text-xs text-[#7a92c1] truncate">{user.email}</p>
                </div>
              </div>
            )}
            {navLinks.map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#2d4070] hover:bg-primary/10 hover:text-primary"
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </>
      )}
    </header>
  );
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f0f5ff] flex flex-col lg:flex-row">
      <DashboardSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <MobileTopBar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
