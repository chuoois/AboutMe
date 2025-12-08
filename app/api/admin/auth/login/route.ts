import { NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import { AuthController } from "@/server/controllers/auth.controller";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    // 1. Lấy device token từ cookie (nếu có)
    const cookieStore = await cookies(); 
    const deviceToken = cookieStore.get("device_token")?.value;
    // 2. Gọi Controller logic
    const result = await AuthController.login(email, password, deviceToken);
    // 3. Nếu Login thành công luôn (Trusted Device)
    if (result.status === "LOGIN_SUCCESS" && result.refreshToken) {  
      // --- SỬA Ở ĐÂY: Dùng biến cookieStore đã await ở trên ---
      cookieStore.set("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 ngày
      });
      return NextResponse.json({ 
        accessToken: result.accessToken,
        status: "LOGIN_SUCCESS" 
      });
    }
    // 4. Nếu cần OTP
    return NextResponse.json({ 
      status: "OTP_SENT", 
      email: result.email 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}