"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  Menu,
  X,
  Briefcase,
  ChevronDown,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  Bookmark,
  Settings,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLoginModal } from "@/store/useLoginModal";
import { useAuthStore } from "@/store/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Navbar({
  transparent = false,
}: {
  transparent?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const loginModal = useLoginModal();
  const { user, setAuth } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        const userData = res.data.user || res.data;
        if (userData) {
          setAuth(userData?.token, userData);
        }
      })
      .catch((err) => {
        console.error("Auth check failed", err);
      });
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
      router.refresh();
    }
  };

  const isTransparent = transparent && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent
        ? "bg-transparent"
        : "bg-white/95 backdrop-blur-xl border-b border-[#e2eaf8] shadow-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-linear-to-br from-primary to-primary/90 rounded-xl flex items-center justify-center shadow-md">
              <Briefcase size={15} className="text-white" />
            </div>
            <span
              className="font-display font-bold text-xl text-[#0c1a3a]"
              style={{ fontFamily: "Sora,sans-serif" }}
            >
              Findur<span className="text-primary">Job</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="nav-link">
              Find Jobs
            </Link>
            <Link href="/companies" className="nav-link">
              Companies
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link flex items-center gap-1 focus:outline-none data-[state=open]:text-blue-600">
                Resources <ChevronDown size={13} />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 rounded-2xl p-2 border-[#e2eaf8] shadow-lg"
              >
                {[
                  ["Resume Builder", "#"],
                  ["Career Blog", "#"],
                  ["Salary Guide", "#"],
                  ["Interview Tips", "#"],
                ].map(([label, href]) => (
                  <DropdownMenuItem
                    key={label}
                    render={<Link href={href} />}
                    className="rounded-xl px-3 py-2.5 text-sm text-[#2d4070] cursor-pointer hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="#" className="nav-link">
              For Employers
            </Link>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "rounded-xl",
                  )}
                >
                  <Bell size={16} />
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2.5 px-3 py-1.5 bg-[#f8fbff] border border-[#e2eaf8] rounded-2xl hover:border-blue-300 hover:shadow-sm transition-all focus:outline-none">
                    <div className="w-7 h-7 bg-linear-to-br from-primary-600 to-primary-500 rounded-full flex items-center justify-center text-black text-xs font-bold shadow-sm">
                      {user.name?.[0] || "U"}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-bold text-black leading-tight">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-[#7a92c1] leading-tight">
                        View Profile
                      </p>
                    </div>
                    <ChevronDown size={12} className="text-[#7a92c1]" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-64 rounded-3xl p-3 border-[#e2eaf8] shadow-xl"
                  >
                    <div className="flex items-center gap-3 p-3 mb-2 bg-[#f8fbff] rounded-2xl">
                      {user.profilePicture ? (
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={user?.profilePicture || ""}
                            alt={user?.name || "Profile"}
                          />
                        </Avatar>
                      ) : (
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="text-xs bg-primary rounded-full flex items-center justify-center text-white font-bold">
                            {user?.name?.[0]?.toUpperCase() || "A"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#0c1a3a] truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-[#7a92c1] truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {[
                        {
                          icon: LayoutDashboard,
                          label: "Dashboard",
                          href: "/dashboard",
                        },
                        { icon: User, label: "My Profile", href: "/profile" },
                        {
                          icon: Bookmark,
                          label: "Saved Jobs",
                          href: "/saved-jobs",
                        },
                        {
                          icon: Settings,
                          label: "Account Settings",
                          href: "/dashboard",
                        },
                      ].map((item) => (
                        <DropdownMenuItem
                          key={item.label}
                          render={<Link href={item.href} />}
                          className="rounded-xl px-3 py-2.5 cursor-pointer"
                        >
                          <div className="flex items-center gap-3 text-sm text-[#2d4070] hover:text-blue-600 hover:bg-blue-50 transition-all group w-full">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                              <item.icon
                                size={14}
                                className="group-hover:text-blue-600"
                              />
                            </div>
                            <span className="font-medium">{item.label}</span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>

                    <DropdownMenuSeparator className="my-2 bg-[#f0f5ff]" />

                    <DropdownMenuItem
                      className="rounded-xl px-3 py-2.5 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50"
                      onClick={logout}
                    >
                      <div className="flex items-center gap-3 w-full transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                          <LogOut size={14} />
                        </div>
                        <span className="font-medium">Sign Out</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    loginModal.onOpen();
                  }}
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "rounded-xl",
                  )}
                >
                  Sign In
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[#2d4070] p-2 rounded-lg hover:bg-blue-50"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#e2eaf8] px-4 py-4 space-y-1">
          {[
            ["Find Jobs", "/jobs"],
            ["Companies", "/companies"],
            ["For Employers", "#"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="block py-2.5 px-3 text-sm text-[#2d4070] hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "w-full rounded-xl",
                  )}
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50",
                  )}
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    loginModal.onOpen();
                  }}
                  className="w-full rounded-xl"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
