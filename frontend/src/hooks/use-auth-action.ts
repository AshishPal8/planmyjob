import { useLoginModal } from "@/store/useLoginModal";
import { useAuthStore } from "@/store/auth-store";

export const useAuthAction = () => {
  const loginModal = useLoginModal();
  const isUserLoggedIn = useAuthStore((s) => !!s.user);

  const execute = (action: () => void) => {
    if (!isUserLoggedIn) {
      return loginModal.onOpen();
    }
    action();
  };

  return { execute };
};
