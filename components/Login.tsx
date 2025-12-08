"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MacWindow from "@/components/macos/MacWindow"; // <-- Bọc MacWindow giống đoạn đầu

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<"LOGIN" | "OTP">("LOGIN");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      if (data.status === "OTP_SENT") {
        setStep("OTP");
      } else if (data.status === "LOGIN_SUCCESS") {
        console.log("Access Token:", data.accessToken);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          remember: rememberMe,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verify failed");

      console.log("Login Success! Token:", data.accessToken);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center bg-gray-100 p-4">
      <MacWindow title="~/auth/login — -bash">
        <div className="p-8 bg-white h-full flex flex-col items-center justify-center">

          <h1 className="text-2xl font-bold mb-4 text-center">Admin Portal</h1>

          {error && (
            <p className="text-red-500 mb-4 text-sm text-center">{error}</p>
          )}

          {step === "LOGIN" ? (
            <form onSubmit={handleLogin} className="space-y-4 w-80">
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 rounded"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 rounded"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />

              <button
                disabled={loading}
                className="w-full bg-blue-600 text-white p-2 rounded"
              >
                {loading ? "Checking..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4 w-80">
              <p className="text-sm text-gray-600">
                Mã OTP đã gửi tới <b>{formData.email}</b>
              </p>

              <input
                type="text"
                placeholder="Nhập mã 6 số"
                className="w-full border p-2 rounded text-center text-xl tracking-widest"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                required
              />

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-sm">
                  Tin cậy thiết bị này (Không hỏi lại OTP)
                </span>
              </label>

              <button
                disabled={loading}
                className="w-full bg-green-600 text-white p-2 rounded"
              >
                {loading ? "Verifying..." : "Confirm OTP"}
              </button>

              <button
                type="button"
                onClick={() => setStep("LOGIN")}
                className="w-full text-gray-500 text-sm"
              >
                Quay lại
              </button>
            </form>
          )}
        </div>
      </MacWindow>
    </section>
  );
}
