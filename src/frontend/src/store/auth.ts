import type { User } from "@/backend";
import { Role } from "@/backend";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  currentUser: User | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      sessionToken: null,
      isAuthenticated: false,
      isAdmin: false,
      setAuth: (user: User, token: string) =>
        set({
          currentUser: user,
          sessionToken: token,
          isAuthenticated: true,
          isAdmin: user.role === Role.admin,
        }),
      logout: () =>
        set({
          currentUser: null,
          sessionToken: null,
          isAuthenticated: false,
          isAdmin: false,
        }),
    }),
    {
      name: "glucofit-auth",
      partialize: (state) => ({
        currentUser: state.currentUser,
        sessionToken: state.sessionToken,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    },
  ),
);
