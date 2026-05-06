import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthController } from "@/server/controllers/auth.controller";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;
    if (refreshToken) {
        await AuthController.logout(refreshToken);
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

  } catch (error) {
    console.error("Logout Error:", error);
    const message = error instanceof Error ? error.message : "Logout failed";
    const res = NextResponse.json(
        { error: message }, 
        { status: 500 }
    );
    // Dù logout thất bại, vẫn xóa cookie trên client để tránh trạng thái không đồng bộ
    res.cookies.delete("access_token");
    res.cookies.delete("refresh_token");
    return res;
  }
}