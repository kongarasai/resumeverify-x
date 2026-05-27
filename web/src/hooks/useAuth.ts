"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

export interface LoginCredentials {
  email: string;
  password: string;
  role?: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: string;
  university?: string;
  department?: string;
}

export function useAuth() {
  const router = useRouter();
  const { user, token, role, isAuthenticated, isLoading, login, logout, updateUser, setLoading } =
    useAuthStore();

  const signIn = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      try {
        const loginPayload = {
          ...credentials,
          role: credentials.role === "ADMIN" ? "SUPER_ADMIN" : credentials.role,
        };
        const response = await apiClient.post<{ user: any; token?: string; accessToken?: string; message: string }>(
          "/auth/login",
          loginPayload
        );
        const tokenVal = response.token || response.accessToken;
        if (!tokenVal) {
          throw new Error("No token received from auth server");
        }
        login(response.user, tokenVal);
        toast.success(`Welcome back, ${response.user.name}! 👋`);

        // Role-based redirect
        const roleRedirects: Record<string, string> = {
          CANDIDATE: "/dashboard",
          TEACHER: "/teacher",
          MENTOR: "/mentor",
          RECRUITER: "/recruiter",
          PLACEMENT_OFFICER: "/placement",
          ADMIN: "/admin",
          SUPER_ADMIN: "/admin",
        };
        router.push(roleRedirects[response.user.role] || "/dashboard");
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message || "Invalid credentials";
        toast.error(msg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [login, router, setLoading]
  );

  const signUp = useCallback(
    async (data: SignupData) => {
      setLoading(true);
      try {
        const signupPayload = {
          ...data,
          role: data.role === "ADMIN" ? "SUPER_ADMIN" : data.role,
        };
        const response = await apiClient.post<{ user: any; token?: string; accessToken?: string; message: string }>(
          "/auth/register",
          signupPayload
        );
        const tokenVal = response.token || response.accessToken;
        if (!tokenVal) {
          throw new Error("No token received from register server");
        }
        login(response.user, tokenVal);
        toast.success("Account created! Welcome to ResumeVerify X™ 🚀");
        router.push("/onboarding");
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message || "Registration failed";
        toast.error(msg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [login, router, setLoading]
  );

  const signOut = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Ignore API errors during logout
    } finally {
      logout();
      toast.success("Logged out successfully");
    }
  }, [logout]);

  const updateProfile = useCallback(
    async (updates: Partial<typeof user>) => {
      if (!user) return;
      try {
        const response = await apiClient.patch<{ user: any }>(`/users/${user.id}`, updates);
        updateUser(response.user);
        toast.success("Profile updated!");
        return response.user;
      } catch (error: any) {
        const msg = error?.response?.data?.message || "Update failed";
        toast.error(msg);
        throw error;
      }
    },
    [user, updateUser]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        await apiClient.post("/auth/change-password", { currentPassword, newPassword });
        toast.success("Password changed successfully!");
      } catch (error: any) {
        const msg = error?.response?.data?.message || "Failed to change password";
        toast.error(msg);
        throw error;
      }
    },
    []
  );

  const hasRole = useCallback(
    (requiredRole: string | string[]) => {
      if (!role) return false;
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      return roles.includes(role);
    },
    [role]
  );

  const isCandidate = role === "CANDIDATE";
  const isTeacher = role === "TEACHER";
  const isMentor = role === "MENTOR";
  const isRecruiter = role === "RECRUITER";
  const isPlacementOfficer = role === "PLACEMENT_OFFICER";
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  return {
    user,
    token,
    role,
    isAuthenticated,
    isLoading,
    isCandidate,
    isTeacher,
    isMentor,
    isRecruiter,
    isPlacementOfficer,
    isAdmin,
    signIn,
    signUp,
    signOut,
    updateProfile,
    changePassword,
    hasRole,
    updateUser,
  };
}
