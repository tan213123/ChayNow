import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, LoginResponse } from "@/types/auth";

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: (data: LoginResponse) => {
        localStorage.setItem("access_token", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refresh_token", data.refreshToken);
        }

        set({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken && isTokenExpired(state.accessToken)) {
          state.logout();
        }
      },
    },
  ),
);
