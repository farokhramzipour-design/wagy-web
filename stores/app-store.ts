"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LANG_STORAGE_KEY } from "@/lib/constants";
import { type Language, type Role, type SitterStatus, type User } from "@/types";

interface AppState {
  language: Language;
  user: User | null;
  role: Role;
  sitterStatus: SitterStatus;
  setLanguage: (language: Language) => void;
  loginAsUser: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  setSitterStatus: (status: SitterStatus) => void;
}

const mockBaseUser: Omit<User, "role" | "id"> = {
  fullName: "Behnam",
  phone: "+1 202 555 0188",
  isSitter: false,
  avatar: "/avatar-placeholder.svg"
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: "en",
      user: null,
      role: "guest",
      sitterStatus: "draft",
      setLanguage: (language) => set({ language }),
      loginAsUser: () =>
        set({
          role: "user",
          user: { id: "u_100", role: "user", ...mockBaseUser }
        }),
      loginAsAdmin: () =>
        set({
          role: "admin",
          user: {
            id: "a_100",
            role: "admin",
            fullName: "Admin Jane",
            phone: "+1 202 555 0199",
            isSitter: false,
            avatar: "/avatar-placeholder.svg"
          }
        }),
      logout: () => set({ role: "guest", user: null, sitterStatus: "draft" }),
      setSitterStatus: (status) =>
        set((state) => ({
          sitterStatus: status,
          user: state.user
            ? {
                ...state.user,
                isSitter: status === "approved"
              }
            : null
        }))
    }),
    {
      name: LANG_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
        user: state.user,
        role: state.role,
        sitterStatus: state.sitterStatus
      })
    }
  )
);
