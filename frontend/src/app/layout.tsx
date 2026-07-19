import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { AuthModalTrigger } from "@/components/auth/AuthModalTrigger";
import LoginModal from "@/modals/login-modal";
import { Toaster } from "sonner";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

export const metadata: Metadata = {
  title: "PlanurJob — Find Your Dream Career in India",
  description:
    "Discover thousands of jobs from top companies. Upload your resume and get matched instantly.",
  keywords: "jobs, careers, hiring, employment, job search india",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <Suspense fallback={null}>
          <AuthModalTrigger />
        </Suspense>
        <LoginModal />
        <Toaster position="top-center" richColors />
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
