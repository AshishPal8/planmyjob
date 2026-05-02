"use client";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLoginModal } from "@/store/useLoginModal";
import { toast } from "sonner";

export function AuthModalTrigger() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const loginModal = useLoginModal();
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (hasTriggered.current) return;

    const loginRequired = searchParams.get("login");
    const redirect = searchParams.get("redirect");
    const error = searchParams.get("error");

    if (error === "unauthorized") {
      hasTriggered.current = true;

      toast.error("Access Denied", {
        description: "You don't have permission to access that page",
      });

      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.pathname + url.search);
      return;
    }

    if (loginRequired === "required") {
      hasTriggered.current = true;

      if (redirect) {
        localStorage.setItem("redirectAfterLogin", redirect);
      }

      loginModal.onOpen();

      const url = new URL(window.location.href);
      url.searchParams.delete("login");
      url.searchParams.delete("redirect");

      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, [searchParams, loginModal, router]);

  return null;
}
