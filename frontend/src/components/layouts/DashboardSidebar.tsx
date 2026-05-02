"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  Briefcase,
  Home,
  Search,
  Send,
  Bookmark,
  User,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

const navItems = [
  { icon: Home, label: "Overview", href: "/dashboard" },
  { icon: Search, label: "Find Jobs", href: "/jobs" },
  { icon: Send, label: "Applications", href: "/dashboard" },
  { icon: Bookmark, label: "Saved Jobs", href: "/saved-jobs" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Bell, label: "Alerts", href: "/dashboard" },
  { icon: Settings, label: "Settings", href: "/dashboard" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  if (!user) return null;

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      router.push("/");
    }
  };

  const completion = 78;

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r border-[#e2eaf8] flex-col fixed inset-y-0 left-0 z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#e2eaf8]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <Briefcase size={15} className="text-white" />
          </div>
          <span
            className="font-bold text-lg text-[#0c1a3a]"
            style={{ fontFamily: "Sora,sans-serif" }}
          >
            Findur<span className="text-blue-600">Job</span>
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-[#e2eaf8]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user.name?.[0] ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-[#0c1a3a] text-sm font-semibold truncate">
              {user.name}
            </p>
            <p className="text-[#7a92c1] text-xs truncate">{user.email}</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[#7a92c1]">Profile complete</span>
            <span className="text-blue-600 font-semibold">{completion}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-2 px-2 py-3 rounded-xl font-semibold ${pathname === item.href ? "text-white bg-primary" : "text-gray-700"}`}
          >
            <item.icon size={16} />
            {item.label}
            {item.label === "Applications" && (
              <span className="ml-auto w-5 h-5 bg-blue-600 rounded-full text-white text-[10px] flex items-center justify-center">
                2
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-[#e2eaf8]">
        <button
          onClick={logout}
          className="sidebar-item w-full hover:text-red-500 hover:bg-red-50"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
