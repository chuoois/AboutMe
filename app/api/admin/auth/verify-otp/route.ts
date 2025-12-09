import { NextResponse } from "next/server";
import { AuthController } from "@/server/controllers/auth.controller";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code, remember } = body;
    const userAgent = req.headers.get("user-agent") || "unknown";

    const result = await AuthController.verifyOtp(email, code, remember, userAgent);

    // Tạo response object
    const res = NextResponse.json({
      status: "LOGIN_SUCCESS",
      accessToken: result.accessToken,
    });

    // 1. Set Refresh Token Cookie
    res.cookies.set("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    // 2. Set Device Token Cookie (Nếu user chọn Remember Me)
    if (result.deviceToken) {
      res.cookies.set("device_token", result.deviceToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 ngày
      });
    }

    return res;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}