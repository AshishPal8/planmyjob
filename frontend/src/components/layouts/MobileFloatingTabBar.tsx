"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useLoginModal } from "@/store/useLoginModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface MobileTabItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number; fill?: string; strokeWidth?: number }>;
  badge?: string | number;
}

interface Props {
  items: MobileTabItem[];
  showAdmin?: boolean;
}

export default function MobileFloatingTabBar({ items, showAdmin = false }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const loginModal = useLoginModal();

  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");
  const isProfileActive = pathname === "/profile";
  const isAdminActive = pathname.startsWith("/admin");

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-sm pointer-events-auto"
    >
      {/* Liquid Glass iPhone Frosted Container (Pure White Translucent Glass) */}
      <div className="flex items-center justify-between gap-1 px-3 py-2 rounded-full bg-white/80 backdrop-blur-2xl border border-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-slate-900/5 transition-all">
        {/* Navigation Tab Items */}
        <div className="flex items-center justify-around flex-1 gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href) && item.href !== "/jobs"
                    ? pathname === item.href
                    : pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex flex-col items-center justify-center py-1 px-2.5 transition-all duration-200 ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <div className="relative">
                  <Icon
                    size={20}
                    className={`shrink-0 transition-transform duration-200 ${
                      isActive
                        ? "scale-115 text-primary fill-primary"
                        : "scale-100 text-slate-400 fill-transparent group-hover:scale-105"
                    }`}
                  />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-2 min-w-3.5 h-3.5 px-1 rounded-full bg-red-500 text-[8px] font-bold text-white flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] tracking-tight mt-1 whitespace-nowrap leading-none transition-colors ${
                    isActive ? "text-primary font-bold" : "text-slate-500 font-medium"
                  }`}
                >
                  {item.label}
                </span>

                {/* Subtle active indicator dot */}
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-primary mt-1 shadow-xs" />
                )}
              </Link>
            );
          })}

          {/* Optional Admin Shortcut (only if showAdmin is true) */}
          {showAdmin && isAdmin && (
            <Link
              href="/admin"
              className={`group relative flex flex-col items-center justify-center py-1 px-2.5 transition-all duration-200 ${
                isAdminActive
                  ? "text-amber-500 font-bold"
                  : "text-slate-400 hover:text-amber-500"
              }`}
            >
              <Shield
                size={20}
                className={`shrink-0 transition-transform duration-200 ${
                  isAdminActive
                    ? "scale-115 text-amber-500 fill-amber-500"
                    : "scale-100 text-slate-400 fill-transparent group-hover:scale-105"
                }`}
              />
              <span
                className={`text-[10px] tracking-tight mt-1 whitespace-nowrap leading-none font-semibold ${
                  isAdminActive ? "text-amber-500" : "text-slate-500"
                }`}
              >
                Admin
              </span>
              {isAdminActive && (
                <span className="w-1 h-1 rounded-full bg-amber-500 mt-1 shadow-xs" />
              )}
            </Link>
          )}
        </div>

        {/* Subtle Frosted Divider */}
        <div className="w-[1px] h-6 bg-slate-200/80 my-auto shrink-0 mx-1" />

        {/* Profile Avatar Button on the Right Corner */}
        <button
          type="button"
          onClick={() => {
            if (user) {
              router.push("/profile");
            } else {
              loginModal.onOpen();
            }
          }}
          className={`group flex flex-col items-center justify-center py-1 px-1.5 transition-all duration-200 shrink-0 ${
            isProfileActive ? "text-primary font-bold" : "text-slate-400 hover:text-slate-700"
          }`}
          title={user ? "Profile" : "Sign In"}
        >
          {user ? (
            <Avatar
              className={`w-6 h-6 transition-transform duration-200 ${
                isProfileActive
                  ? "scale-115 ring-2 ring-primary ring-offset-1 ring-offset-white shadow-xs"
                  : "ring-1 ring-slate-200 group-hover:scale-105"
              }`}
            >
              {user.profilePicture && (
                <AvatarImage src={user.profilePicture} alt={user.name || "Profile"} />
              )}
              <AvatarFallback
                className={`text-[10px] font-black flex items-center justify-center ${
                  isProfileActive ? "bg-primary text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {user.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform ${
                isProfileActive
                  ? "scale-115 bg-primary text-white"
                  : "bg-slate-100 text-slate-500 group-hover:scale-105"
              }`}
            >
              <UserIcon size={13} />
            </div>
          )}
          <span
            className={`text-[9px] mt-1 tracking-tight font-medium leading-none ${
              isProfileActive ? "text-primary font-bold" : "text-slate-500"
            }`}
          >
            {user ? "Profile" : "Login"}
          </span>

          {isProfileActive && (
            <span className="w-1 h-1 rounded-full bg-primary mt-1 shadow-xs" />
          )}
        </button>
      </div>
    </nav>
  );
}
