"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppLanguage, AppRole, AppUser, SitterStatus } from "@/types/auth";

type AppStore = {
  language: AppLanguage;
  user: AppUser | null;
  role: AppRole;
  sitterStatus: SitterStatus;
  setLanguage: (language: AppLanguage) => void;
  loginAsUser: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  setSitterStatus: (status: SitterStatus) => void;
};

const ownerSeed: AppUser = {
  id: "u_100",
  fullName: "Behnam",
  phone: "+98 912 123 4567",
  avatar: "/avatar-placeholder.svg"
};

const adminSeed: AppUser = {
  id: "a_100",
  fullName: "Admin Jane",
  phone: "+1 202 555 0199",
  avatar: "/avatar-placeholder.svg"
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      language: "en",
      user: null,
      role: "guest",
      sitterStatus: "draft",
      setLanguage: (language) => set({ language }),
      loginAsUser: () => set({ user: ownerSeed, role: "user" }),
      loginAsAdmin: () => set({ user: adminSeed, role: "admin" }),
      logout: () => set({ user: null, role: "guest", sitterStatus: "draft" }),
      setSitterStatus: (status) =>
        set((state) => ({
          sitterStatus: status,
          user: state.user ? { ...state.user } : null
        }))
    }),
    {
      name: "waggy-app-store",
      partialize: (state) => ({
        language: state.language,
        user: state.user,
        role: state.role,
        sitterStatus: state.sitterStatus
      })
    }
  )
);
