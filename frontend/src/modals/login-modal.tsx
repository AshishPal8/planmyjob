"use client";
import { Google, LoginBg } from "@/assets";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { envConfig } from "@/config/env.config";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";
import { useLoginModal } from "@/store/useLoginModal";
import { useMediaQuery } from "../hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "../components/ui/drawer";

const LoginModal = () => {
  const { isOpen, onClose } = useLoginModal();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const Content = (
    <div className="overflow-hidden border-none rounded-t-3xl md:rounded-3xl gap-0 bg-card">
      <div className="relative w-full h-48">
        <Image
          src={LoginBg}
          alt="Login Header"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-card via-card/40 to-transparent" />
      </div>

      <div className="px-6 pb-8 pt-2">
        {isDesktop ? (
          <>
            <DialogTitle className="text-primary font-bold text-2xl">
              Login to PlanMyJob
            </DialogTitle>
            <DialogDescription className="font-semibold mb-4">
              Enter your social account to continue
            </DialogDescription>
          </>
        ) : (
          <>
            <DrawerTitle className="text-primary font-bold text-2xl">
              Login to PlanMyJob
            </DrawerTitle>
            <DrawerDescription className="font-semibold mb-4">
              Enter your social account to continue
            </DrawerDescription>
          </>
        )}

        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => {
              trackEvent("login");
              window.location.href = `${envConfig.apiUrl}/auth/google`;
            }}
            size="lg"
            className="w-full gap-3 h-12 cursor-pointer"
          >
            <Image src={Google} alt="Google" width={22} height={22} />
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-100 p-0 overflow-hidden border-none rounded-3xl">
          {Content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="p-0 border-none bg-transparent">
        {Content}
      </DrawerContent>
    </Drawer>
  );
};

export default LoginModal;
