"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Admin {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
}

interface AuthState {
  admin: Admin | null;
  access: string | null;
  refresh: string | null;
  setAdminData: (admin: Admin | null, access: string | null, refresh?: string | null) => void;
  clearAdminData: () => void; // renamed for clarity
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      access: null,
      refresh: null,

      setAdminData: (admin, access, refresh = null) =>
        set({ admin, access, refresh }),

      clearAdminData: () =>
        set({ admin: null, access: null, refresh: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);