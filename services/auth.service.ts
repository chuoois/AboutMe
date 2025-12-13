// services/auth.service.ts
import { api } from "@/lib/axios";

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response;
  },
  verifyOtp: async (email: string, code: string, remember: boolean = false) => {
    const response = await api.post("/auth/verify-otp", { email, code, remember, });
    return response;
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