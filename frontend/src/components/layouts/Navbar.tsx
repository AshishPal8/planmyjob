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
  User,
  LogOut,
  LayoutDashboard,
  Bookmark,
  Settings,
  Shield,
  Sparkles,
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
import Logo from "./Logo";

export default function Navbar({
  transparent = false,
}: {
  transparent?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const loginModal = useLoginModal();
  const { user, setUser } = useAuthStore();

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
        if (userData?.id) {
          setUser(userData);
        }
      })
      .catch(() => {});
  }, [setUser]);

  const { logout: clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      clearAuth();
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
      clearAuth();
      router.push("/");
    }
  };

  const isTransparent = transparent && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-xl border-b border-[#e2eaf8] shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-4">
            {/* <Link href="/recommended-jobs" className="nav-link text-sm">
              Recommended Jobs
            </Link> */}
            <Link href="/jobs" className="nav-link text-sm">
              Find Jobs
            </Link>
            <Link href="/match-resume" className="nav-link text-sm">
              Match My Resume
            </Link>
            <Link href="/about" className="nav-link text-sm">
              About Us
            </Link>
            <Link href="/contact" className="nav-link text-sm">
              Contact Us
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 md:gap-3">
            {user && (user.role === "admin" || user.role === "superadmin") && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 shadow-sm transition-all"
              >
                <Shield size={13} />
                <span>Admin Panel</span>
              </Link>
            )}

            {user ? (
              <>
                {/* Mobile hamburger */}
                <button
                  onClick={() => setOpen(!open)}
                  className="lg:hidden text-[#2d4070] p-2 rounded-lg hover:bg-primary/10"
                >
                  {open ? <X size={20} /> : <Menu size={20} />}
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2.5 px-3 py-1.5 bg-[#f8fbff] border border-[#e2eaf8] rounded-2xl hover:border-blue-300 hover:shadow-sm transition-all focus:outline-none">
                    {user.profilePicture ? (
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={user?.profilePicture || ""}
                          alt={user?.name || "Profile"}
                        />
                      </Avatar>
                    ) : (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-primary rounded-full flex items-center justify-center text-white font-bold">
                          {user?.name?.[0]?.toUpperCase() || "A"}
                        </AvatarFallback>
                      </Avatar>
                    )}
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
                      {(user.role === "admin" || user.role === "superadmin") && (
                        <DropdownMenuItem
                          render={<Link href="/admin" />}
                          className="rounded-xl px-3 py-2.5 cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary mb-1 font-semibold"
                        >
                          <div className="flex items-center gap-3 text-sm text-primary w-full">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                              <Shield size={14} />
                            </div>
                            <span className="font-bold">SuperAdmin Panel</span>
                          </div>
                        </DropdownMenuItem>
                      )}

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
                          href: "/profile",
                        },
                      ].map((item) => (
                        <DropdownMenuItem
                          key={item.label}
                          render={<Link href={item.href} />}
                          className="rounded-xl px-3 py-2.5 cursor-pointer"
                        >
                          <div className="flex items-center gap-3 text-sm text-[#2d4070] w-full">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                              <item.icon size={14} />
                            </div>
                            <span className="font-medium">{item.label}</span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>

                    <DropdownMenuSeparator className="my-2 bg-[#f0f5ff]" />

                    <DropdownMenuItem
                      className="rounded-xl px-3 py-2.5 cursor-pointer text-red-500"
                      onClick={handleLogout}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
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
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-[#e2eaf8] px-3 py-3 space-y-0.5">
          {[
            // ["Recommended Jobs", "/recommended-jobs"],
            ["Find Jobs", "/jobs"],
            ["Match My Resume", "/match-resume"],
            ["About Us", "/about"],
            ["Contact Us", "/contact"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="block py-1.5 px-3 text-xs text-[#2d4070] rounded-lg font-medium"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            {user ? (
              <>
                {(user.role === "admin" || user.role === "superadmin") && (
                  <Link
                    href="/admin"
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "w-full rounded-xl gap-2 font-bold",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Shield size={16} />
                    Admin Panel
                  </Link>
                )}
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
                    handleLogout();
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
