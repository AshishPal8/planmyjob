"use client";
import React from "react";
import { Home, Search, Sparkles, Zap } from "lucide-react";
import MobileFloatingTabBar, { type MobileTabItem } from "./MobileFloatingTabBar";

const rootNavItems: MobileTabItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Jobs", href: "/jobs", icon: Search },
  { label: "ATS Check", href: "/ats-checker", icon: Sparkles },
  { label: "Match", href: "/match-resume", icon: Zap },
];

export default function RootMobileTabBar() {
  return <MobileFloatingTabBar items={rootNavItems} />;
}
