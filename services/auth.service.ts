// services/auth.service.ts
import { api } from "@/lib/axios";

export const authService = {
  login: async (email: string, password: string) => {
    return api.post("/auth/login", { email, password });
  },
  verifyOtp: async (email: string, code: string, remember: boolean = false) => {
    return api.post("/auth/verify-otp", { email, code, remember });
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  },
};
