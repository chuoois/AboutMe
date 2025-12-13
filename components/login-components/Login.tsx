"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import MacWindow from "@/components/macos-components/MacWindow";
import { authService } from "@/services/auth.service"; 

export default function LoginForm() {
  const router = useRouter();
  const otpInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<"LOGIN" | "OTP">("LOGIN");
  const [emailForVerification, setEmailForVerification] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpFocused, setIsOtpFocused] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================
  // XỬ LÝ LOGIN
  // ==========================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authService.login(formData.email, formData.password);
      const data = res.data; 
      console.log("Login response data:", data);
      
      if (data.status === "OTP_SENT") {
        setEmailForVerification(formData.email); 
        setStep("OTP");
        setError("");
        setFormData((prev) => ({ ...prev, password: "", code: "" }));
        
        setTimeout(() => {
          otpInputRef.current?.focus();
        }, 100);

      } 
      else if (data.status === "LOGIN_SUCCESS") {
        router.push("/settings");
      } else {
         setError(data.message || "Login failed");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // XỬ LÝ VERIFY OTP
  // ==========================
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.code.length < 6) {
      setError("Please enter full 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (!emailForVerification) {
        setError("Verification email is missing.");
        setLoading(false);
        setStep("LOGIN");
        return;
      }
      const res = await authService.verifyOtp(
        emailForVerification,
        formData.code,
        rememberMe
      );

      const data = res.data; 

      if (data.status === "LOGIN_SUCCESS") {
        router.push("/settings");
      } else {
        setError(data.message || "Verification failed");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Invalid OTP code";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center p-4">
      
      {/* Container: Dark Mode Style */}
      <MacWindow title="~/auth/login — -zsh" className="dark max-w-[420px] h-auto shadow-2xl">
        <div className="w-full flex flex-col items-center justify-center p-8 bg-[#1e1e1e]/95 backdrop-blur-xl relative rounded-b-xl min-h-[450px]">

          {/* Avatar User - Dark Mode Glow */}
          <div className="mb-8 flex flex-col items-center animate-mac-pop">
            <div className="relative group">
               {/* Glow effect */}
               <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-50 blur transition duration-500"></div>
               
               <div className="relative w-24 h-24 rounded-full bg-[#252525] border border-white/10 shadow-inner flex items-center justify-center mb-4 overflow-hidden">
                 <i className="bx bxs-user bx-lg text-gray-400 group-hover:text-white transition-colors duration-300"></i>
               </div>
            </div>
            
            <h1 className="text-xl font-bold text-white tracking-tight">
              {step === "LOGIN" ? "System Access" : "Two-Factor Auth"}
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-mono">
              {step === "LOGIN" ? "Please identify yourself" : `Sent to: ${emailForVerification}`}
            </p>
          </div>

          {/* Error Message - Dark Mode */}
          {error && (
            <div className="mb-6 w-full bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-lg text-xs font-medium text-center flex items-center justify-center gap-2 animate-pulse">
              <i className='bx bx-error-circle text-lg'></i>
              <span>{error}</span>
            </div>
          )}

          {step === "LOGIN" ? (
            <form onSubmit={handleLogin} className="space-y-5 w-full">
              {/* Email Input */}
              <div className="relative group">
                <i className="bx bx-user absolute left-3 top-2.5 w-5 h-5 text-gray-500 transition-colors group-focus-within:text-blue-400"></i>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-[#1a1a1a] border border-white/10 text-white rounded-lg py-2.5 pl-10 pr-3 text-sm placeholder:text-gray-600 
                             focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <i className="bx bx-lock-alt absolute left-3 top-2.5 w-5 h-5 text-gray-500 transition-colors group-focus-within:text-blue-400"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full bg-[#1a1a1a] border border-white/10 text-white rounded-lg py-2.5 pl-10 pr-10 text-sm placeholder:text-gray-600 
                             focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-300 cursor-pointer transition-colors focus:outline-none"
                >
                  <i className={`bx ${showPassword ? 'bx-hide' : 'bx-show'} text-lg`}></i>
                </button>
              </div>

              {/* Submit Button */}
              <button
                disabled={loading}
                className="w-full h-10 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-semibold rounded-lg 
                           shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? <><i className="bx bx-loader-alt bx-spin text-lg"></i> Authenticating...</> : "Login"}
              </button>
            </form>

          ) : (
            <form onSubmit={handleVerify} className="space-y-6 w-full animate-in slide-in-from-right-8 fade-in duration-300">
              
              {/* OTP Inputs - Dark Mode Squares */}
              <div className="relative w-full h-14 select-none flex justify-center">
                <input
                  ref={otpInputRef}
                  type="text"
                  maxLength={6}
                  value={formData.code}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, code: val });
                  }}
                  onFocus={() => setIsOtpFocused(true)}
                  onBlur={() => setIsOtpFocused(false)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-text z-20"
                  autoFocus
                  autoComplete="one-time-code"
                />
                <div className="absolute inset-0 flex justify-between gap-2 pointer-events-none z-10">
                  {[0, 1, 2, 3, 4, 5].map((index) => {
                    const digit = formData.code[index] || "";
                    const isActive = isOtpFocused && index === formData.code.length;
                    const isFilled = index < formData.code.length;

                    return (
                      <div
                        key={index}
                        className={`
                          w-10 h-12 rounded-lg border 
                          flex items-center justify-center text-xl font-bold transition-all duration-200 font-mono
                          ${isActive
                            ? "border-blue-500 ring-2 ring-blue-500/20 bg-[#252525] text-white scale-105 z-10"
                            : "border-white/10 bg-[#1a1a1a]"
                          }
                          ${isFilled ? "text-white border-white/20" : "text-transparent"}
                        `}
                      >
                        {digit}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Remember Me - Dark Mode Checkbox */}
              <div className="flex justify-center">
                <label className="flex items-center space-x-2.5 cursor-pointer group select-none">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 
                                  ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-600 bg-[#1a1a1a] group-hover:border-gray-500'}`}>
                    {rememberMe && <i className='bx bx-check text-white text-xs'></i>}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                    Trust this device for 30 days
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("LOGIN");
                    setError("");
                    setFormData((prev) => ({ ...prev, code: "" }));
                  }}
                  className="h-10 text-gray-300 bg-[#252525] hover:bg-[#303030] border border-white/5 rounded-lg text-sm font-medium transition-all"
                >
                  Back
                </button>

                <button
                  disabled={loading || formData.code.length < 6}
                  className="h-10 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-semibold rounded-lg 
                             shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
                >
                  {loading ? <><i className="bx bx-loader-alt bx-spin"></i></> : "Verify OTP"}
                </button>
              </div>
            </form>
          )}
        </div>
      </MacWindow>
    </section>
  );
}