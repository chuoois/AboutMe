"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MacWindow from "@/components/macos/MacWindow";
import { AuthService, LoginResponse } from "@/services/auth.services";

// 1. XÓA import Lucide icons: 
// import { User, Lock, KeyRound, ArrowLeft, Loader2, ShieldCheck } from "lucide-react"; 

// 2. Thay thế bằng Boxicons (không cần import component nếu bạn dùng CSS class)

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<"LOGIN" | "OTP">("LOGIN");
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================
  // LOGIN STEP 1
  // ==========================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res: LoginResponse = await AuthService.login(
        formData.email,
        formData.password
      );
      console.log("Login Response:", res);

      if (res.status === "OTP_SENT") {
        setAdminEmail(res.email);
        setStep("OTP");
      } else if (res.status === "LOGIN_SUCCESS") {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // VERIFY OTP STEP 2
  // ==========================
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await AuthService.verifyOtp(
        adminEmail!,
        formData.code,
        rememberMe
      );

      if (res.status === "LOGIN_SUCCESS") {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Background đã được xử lý bởi globals.css (gradient), container này trong suốt
    <section className="w-full h-screen flex items-center justify-center p-4">
      <MacWindow title="~/auth/login — -zsh">
        {/* Nội dung bên trong cửa sổ Mac */}
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-mac-light-window/60 backdrop-blur-xl relative">
          
          {/* Avatar User giả lập giống Mac Login Screen */}
          <div className="mb-6 flex flex-col items-center animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-inner flex items-center justify-center mb-3 border-4 border-white/50">
              {/* Thay thế: <User className="w-10 h-10 text-gray-600" /> */}
              <i className="bx bxs-user bx-lg text-gray-600"></i>
            </div>
            <h1 className="text-xl font-semibold text-mac-light-text tracking-tight">
              {step === "LOGIN" ? "Administrator" : formData.email}
            </h1>
            <p className="text-sm text-mac-light-subtext mt-1">
              {step === "LOGIN" ? "Enter your credentials" : "Security Verification"}
            </p>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="mb-5 w-80 bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-2 rounded-lg text-sm text-center flex items-center justify-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {step === "LOGIN" ? (
            // ==========================
            // FORM LOGIN
            // ==========================
            <form onSubmit={handleLogin} className="space-y-4 w-72">
              {/* Email Input */}
              <div className="relative group">
                {/* Thay thế: <User className="absolute left-3 top-2.5 w-4 h-4 text-mac-light-subtext transition-colors group-focus-within:text-mac-systemBlue" /> */}
                <i className="bx bx-user absolute left-3 top-2.5 w-4 h-4 text-mac-light-subtext transition-colors group-focus-within:text-mac-systemBlue"></i>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-white/70 border border-mac-light-border text-mac-light-text rounded-lg py-2 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-mac-systemBlue/30 focus:bg-white transition-all shadow-sm"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                {/* Thay thế: <Lock className="absolute left-3 top-2.5 w-4 h-4 text-mac-light-subtext transition-colors group-focus-within:text-mac-systemBlue" /> */}
                <i className="bx bx-lock-alt absolute left-3 top-2.5 w-4 h-4 text-mac-light-subtext transition-colors group-focus-within:text-mac-systemBlue"></i>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-white/70 border border-mac-light-border text-mac-light-text rounded-lg py-2 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-mac-systemBlue/30 focus:bg-white transition-all shadow-sm"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              {/* Login Button */}
              <button
                disabled={loading}
                className="w-full h-9 bg-mac-systemBlue hover:bg-mac-systemBlue/90 active:scale-95 text-white text-sm font-medium rounded-lg shadow-mac-btn transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    {/* Thay thế: <Loader2 className="w-4 h-4 animate-spin" /> */}
                    <i className="bx bx-loader-alt bx-spin w-4 h-4"></i> Checking...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          ) : (
            // ==========================
            // FORM OTP
            // ==========================
            <form onSubmit={handleVerify} className="space-y-5 w-72 animate-in slide-in-from-right-10 fade-in duration-300">
              <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mb-2">
                    {/* Thay thế: <ShieldCheck className="w-5 h-5 text-green-600" /> */}
                    <i className="bx bx-shield-check bx-sm text-green-600"></i>
                  </div>
                  <p className="text-xs text-mac-light-subtext">
                    Mã OTP đã gửi tới <br/><span className="font-medium text-mac-light-text">{formData.email}</span>
                  </p>
              </div>

              {/* OTP Input */}
              <div className="relative group">
                {/* Thay thế: <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-mac-light-subtext transition-colors group-focus-within:text-green-600" /> */}
                <i className="bx bx-key absolute left-3 top-2.5 w-4 h-4 text-mac-light-subtext transition-colors group-focus-within:text-green-600"></i>
                <input
                  type="text"
                  placeholder="######"
                  maxLength={6}
                  className="w-full bg-white/70 border border-mac-light-border text-mac-light-text rounded-lg py-2 pl-10 pr-3 text-center text-xl tracking-[0.5em] font-mono placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all shadow-sm"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.replace(/\D/g, '') })
                  }
                  required
                />
              </div>

              {/* Remember Me Checkbox */}
              <label className="flex items-center justify-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="accent-mac-systemBlue w-4 h-4 rounded border-gray-300"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-xs text-mac-light-subtext group-hover:text-mac-light-text transition-colors">
                  Trust this device
                </span>
              </label>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  disabled={loading}
                  className="w-full h-9 bg-green-600 hover:bg-green-700 active:scale-95 text-white text-sm font-medium rounded-lg shadow-mac-btn transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                      <>
                      {/* Thay thế: <Loader2 className="w-4 h-4 animate-spin" /> */}
                      <i className="bx bx-loader-alt bx-spin w-4 h-4"></i> Verifying...
                    </>
                    ) : (
                      "Confirm"
                    )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                      setStep("LOGIN");
                      setError("");
                  }}
                  className="w-full h-8 text-mac-light-subtext hover:text-mac-light-text text-sm hover:bg-black/5 rounded-lg transition-all flex items-center justify-center gap-1"
                >
                  {/* Thay thế: <ArrowLeft className="w-3 h-3" /> */}
                  <i className="bx bx-arrow-back w-3 h-3"></i> Back
                </button>
              </div>
            </form>
          )}
        </div>
      </MacWindow>
    </section>
  );
}