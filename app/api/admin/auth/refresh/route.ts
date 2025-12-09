import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthController } from "@/server/controllers/auth.controller";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const oldRefreshToken = cookieStore.get("refresh_token")?.value;

  if (!oldRefreshToken) {
    return NextResponse.json({ error: "REFRESH_TOKEN_MISSING" }, { status: 401 });
  }

  try {
    const result = await AuthController.refreshToken(oldRefreshToken);

    const res = NextResponse.json({ 
      accessToken: result.accessToken 
    });

    // Token Rotation: Cập nhật Refresh Token mới vào Cookie
    res.cookies.set("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (error: any) {
    const res = NextResponse.json({ error: error.message }, { status: 401 });

    // Xóa cookie nếu refresh thất bại (hết hạn hoặc không hợp lệ)
    res.cookies.delete("refresh_token");
    // Tùy chọn: Xóa luôn device token
    // res.cookies.delete("device_token");

    return res;
  }
}