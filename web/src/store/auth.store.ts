import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserRole =
  | "CANDIDATE"
  | "TEACHER"
  | "MENTOR"
  | "RECRUITER"
  | "PLACEMENT_OFFICER"
  | "UNIVERSITY_ADMIN"
  | "COMPANY_ADMIN"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  university?: string;
  department?: string;
  bio?: string;
  trustScore?: number;
  isVerified?: boolean;
  githubConnected?: boolean;
  leetcodeConnected?: boolean;
  createdAt?: string;
  profileCompletion?: number;
  phone?: string;
  githubUsername?: string;
  leetcodeUsername?: string;
  linkedinUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null,
      isLoading: false,
      isAuthenticated: false,

      login: (user: User, token: string) => {
        // Save token to cookie for middleware
        if (typeof document !== "undefined") {
          const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
          document.cookie = `rvx_token=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax`;
        }

        // Save to localStorage
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("rvx_token", token);
        }

        set({
          user,
          token,
          role: user.role,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        // Clear cookie
        if (typeof document !== "undefined") {
          document.cookie = "rvx_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }

        // Clear localStorage
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("rvx_token");
          localStorage.removeItem("rvx_user");
          localStorage.removeItem("rvx-auth-store");
        }

        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
        });

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: { ...currentUser, ...updates },
          role: updates.role || currentUser.role,
        });
      },

      setToken: (token: string) => {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("rvx_token", token);
        }
        set({ token });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: "rvx-auth-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
