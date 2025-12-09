import { fetchData } from "@/lib/fetchdata"; // Giả định bạn đã có hàm wrapper này

// ==========================
// 1. Types Definitions
// ==========================

// Kết quả khi đăng nhập thành công (Có token luôn - Trusted Device)
export interface LoginSuccess {
  status: "LOGIN_SUCCESS";
  accessToken: string;
}

// Kết quả khi cần xác thực OTP (Untrusted Device)
export interface LoginRequireOtp {
  status: "OTP_SENT";
  email: string; // Backend trả về email để dùng cho bước verify
}

export type LoginResponse = LoginSuccess | LoginRequireOtp;

export interface VerifyOtpResponse {
  status: "LOGIN_SUCCESS";
  accessToken: string;
}

// ==========================
// 2. Service Implementation
// ==========================
export const AuthService = {
  
  // Bước 1: Login
  async login(email: string, password: string): Promise<LoginResponse> {
    return await fetchData<LoginResponse>("/api/admin/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },

  // Bước 2: Verify OTP
  // Lưu ý: Backend verify cần 'email' chứ không phải 'adminId'
  async verifyOtp(email: string, otp: string, remember: boolean): Promise<VerifyOtpResponse> {
    return await fetchData<VerifyOtpResponse>("/api/admin/auth/verify-otp", {
      method: "POST",
      body: { email, code: otp, remember }, 
    });
  },

  // Refresh Token (Dùng cho interceptor hoặc gọi thủ công)
  async refreshToken(): Promise<{ accessToken: string }> {
    return await fetchData<{ accessToken: string }>("/api/admin/auth/refresh", {
      method: "POST",
    });
  },

  // Logout
  async logout(): Promise<void> {
    return await fetchData("/api/admin/auth/logout", {
      method: "POST",
    });
  },
};