import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthController } from "@/server/controllers/auth.controller";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;
    const deviceToken = cookieStore.get("device_token")?.value;
    if (refreshToken) {
        await AuthController.logout(refreshToken, deviceToken);
    }
    const res = NextResponse.json({
      status: "LOGGED_OUT",
      message: "Đăng xuất thành công"
    });

    // Xóa Access Token
    res.cookies.delete("access_token");
    // Xóa Refresh Token
    res.cookies.delete("refresh_token");

    return res;

  } catch (error: any) {
    console.error("Logout Error:", error);
    const res = NextResponse.json(
        { error: error.message || "Logout failed" }, 
        { status: 500 }
    );
    // Dù logout thất bại, vẫn xóa cookie trên client để tránh trạng thái không đồng bộ
    res.cookies.delete("access_token");
    res.cookies.delete("refresh_token");
    return res;
  }
}