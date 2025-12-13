// lib/axios.ts
import axios from "axios";

const getBaseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return "https://myapp.example.com/api";
  }
  return "http://localhost:3000/api"; 
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
// Response Interceptor - Xử lý refresh token
// ============================================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi lại request (middleware sẽ tự động refresh token)
        return api(originalRequest);
      } catch (retryError) {
        // Nếu vẫn fail → redirect login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(retryError);
      }
    }

    return Promise.reject(error);
  }
);