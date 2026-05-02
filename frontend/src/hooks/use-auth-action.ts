import { useLoginModal } from "@/store/useLoginModal";

export const useAuthAction = () => {
  const loginModal = useLoginModal();
  const isUserLoggedIn = false;

  const execute = (action: () => void) => {
    if (!isUserLoggedIn) {
      return loginModal.onOpen();
    }
    action();
  };

  return { execute };
};
