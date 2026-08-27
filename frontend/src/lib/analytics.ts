export type AnalyticsEvent =
  | "sign_up"
  | "login"
  | "resume_uploaded"
  | "ats_scan_completed"
  | "ats_score_viewed"
  | "job_search"
  | "job_view"
  | "job_apply"
  | "save_job"
  | "profile_completed";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  event: AnalyticsEvent,
  params?: Record<string, unknown>,
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", event, params);
}
