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
      status: "LOGIN_SUCCESS"
    });

    res.cookies.set("access_token", result.accessToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 5 * 60,
    });

    res.cookies.set("refresh_token", result.refreshToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    // Device token (remember me)
    if (result.deviceToken) {
      res.cookies.set("device_token", result.deviceToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 30 * 24 * 60 * 60
      });
    }

    return res;

  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}