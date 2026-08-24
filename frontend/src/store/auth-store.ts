import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WorkExperience {
  id?: number;
  title: string;
  company: string;
  location: string;
  fromDate: string;
  toDate: string | null;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id?: number;
  degreeTitle: string;
  university: string;
  location: string;
  fromDate: string;
  toDate: string | null;
  isCurrent: boolean;
  percentage: number | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  profilePicture?: string;
  location?: string;
  headline?: string;
  about?: string;
  skills?: string[];
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  openToWork?: boolean;
  profileScore?: number;
  profileScoreBreakdown?: Record<string, boolean>;
  workExperiences?: WorkExperience[];
  educations?: Education[];
}


interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
      isAuthenticated: () => !!get().user,
    }),
    { name: "auth-storage" },
  ),
);
