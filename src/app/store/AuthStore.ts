import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Admin {
  email: string;
  is_superuser: boolean;
  user_id: string | number;
}

interface AuthState {
  admin: Admin | null;
  access: string | null;
  refresh: string | null;

  setAdminData: (
    admin: Admin,
    access: string,
    refresh: string
  ) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      access: null,
      refresh: null,

      setAdminData: (admin, access, refresh) =>
        set({
          admin,
          access,
          refresh,
        }),

      logout: () =>
        set({
          admin: null,
          access: null,
          refresh: null,
        }),
    }),
    {
      name: "auth-storage", 
    }
  )
);
