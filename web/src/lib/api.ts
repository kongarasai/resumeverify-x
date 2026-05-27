import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Request interceptor — attach Bearer token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Try localStorage first, then cookie
    let token: string | null = null;

    if (typeof window !== "undefined") {
      token = localStorage.getItem("rvx_token");

      if (!token) {
        // Try to get from cookie
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split("=");
          if (name === "rvx_token") {
            token = decodeURIComponent(value);
            break;
          }
        }
      }
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear auth state
      if (typeof window !== "undefined") {
        localStorage.removeItem("rvx_token");
        localStorage.removeItem("rvx_user");

        // Clear cookie
        document.cookie = "rvx_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Redirect to login
        const currentPath = window.location.pathname;
        if (!currentPath.includes("/login") && !currentPath.includes("/signup")) {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Typed helper methods
export const apiClient = {
  get: <T>(url: string, config?: object) =>
    api.get<T>(url, config).then((r) => r.data),

  post: <T>(url: string, data?: unknown, config?: object) =>
    api.post<T>(url, data, config).then((r) => r.data),

  put: <T>(url: string, data?: unknown, config?: object) =>
    api.put<T>(url, data, config).then((r) => r.data),

  patch: <T>(url: string, data?: unknown, config?: object) =>
    api.patch<T>(url, data, config).then((r) => r.data),

  delete: <T>(url: string, config?: object) =>
    api.delete<T>(url, config).then((r) => r.data),

  upload: <T>(url: string, formData: FormData, onProgress?: (p: number) => void) =>
    api
      .post<T>(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(pct);
          }
        },
      })
      .then((r) => r.data),
};

export default api;
