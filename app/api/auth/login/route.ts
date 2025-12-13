import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthController } from "@/server/controllers/auth.controller";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Lấy device token từ cookie request (Read-only OK)
    const cookieStore = await cookies();
    const deviceToken = cookieStore.get("device_token")?.value;

    // 2. Gọi Controller
    const result: any = await AuthController.login(email, password, deviceToken);

    // 3. Trường hợp 1: Login thành công luôn (Trusted Device)
    if (result.status === "LOGIN_SUCCESS") {
      const res = NextResponse.json({
        status: "LOGIN_SUCCESS"
      });

      // Access-Token Cookie
      res.cookies.set("access_token", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 5 * 60 // 5 phút
      });

      // Refresh-Token Cookie
      res.cookies.set("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return res;
    }


    // 4. Trường hợp 2: Cần OTP
    return NextResponse.json({
      status: "OTP_SENT",
      email: result.email
    });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}