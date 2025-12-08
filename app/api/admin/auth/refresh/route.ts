import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthController } from "@/server/controllers/auth.controller";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const oldRefreshToken = cookieStore.get("refresh_token")?.value;

    if (!oldRefreshToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // 1. Gọi logic refresh (Token Rotation)
    const result = await AuthController.refreshToken(oldRefreshToken);

    // 2. Cập nhật cookie refresh token mới (Rotation)
    cookieStore.set("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json({ accessToken: result.accessToken });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}