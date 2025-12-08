import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthController } from "@/server/controllers/auth.controller";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code, remember } = body;
    const userAgent = req.headers.get("user-agent") || "unknown";

    // 1. Gọi Verify
    const result = await AuthController.verifyOtp(email, code, remember, userAgent);

    const cookieStore = cookies();

    // 2. Set Refresh Token Cookie
    cookieStore.set("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 ngày
    });

    // 3. Set Device Token Cookie (Nếu user chọn Remember Me)
    if (result.deviceToken) {
      cookieStore.set("device_token", result.deviceToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 ngày
      });
    }

    return NextResponse.json({ accessToken: result.accessToken });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}