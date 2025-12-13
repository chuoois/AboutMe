import { NextRequest, NextResponse } from "next/server";
import { verify, JwtPayload, sign } from "jsonwebtoken";
import { getDataSource } from "@/server/db/connection";
import { RefreshToken } from "@/server/entities/refresh_tokens.entity";

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, adminId: number) => Promise<any>
) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  console.log("Cookies object:", request.cookies);
  console.log("Access token:", accessToken);
  console.log("Refresh token:", refreshToken);

  const dataSource = await getDataSource();

  // =========================
  // 1. Access token còn hiệu lực
  // =========================
  if (accessToken) {
    try {
      const decoded = verify(accessToken, process.env.JWT_SECRET!) as JwtPayload;
      const adminId = (decoded as any).id;
      return await handler(request, adminId);
    } catch (err) {
      // Access token hết hạn -> dùng refresh token
    }
  }

  // =========================
  // 2. Nếu không có refresh token
  // =========================
  if (!refreshToken) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    // Verify refresh token signature
    const decoded = verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
    const adminId = (decoded as any).id;

    // Check token trong DB
    const rtRepo = dataSource.getRepository(RefreshToken);
    const existingToken = await rtRepo.findOne({ where: { token: refreshToken }, relations: ["admin"] });

    if (!existingToken || existingToken.expires_at < new Date()) {
      return NextResponse.json({ error: "REFRESH_TOKEN_EXPIRED" }, { status: 401 });
    }

    // =========================
    // 3. Cấp access token mới (không xoá refresh token cũ)
    // =========================
    const newAccessToken = sign(
      { id: existingToken.admin.id, email: existingToken.admin.email },
      process.env.JWT_SECRET!,
      { expiresIn: "5m" }
    );

    // Call handler với adminId
    const data = await handler(request, existingToken.admin.id);

    // Set cookie mới cho access token
    const response = NextResponse.json(data);
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 5 * 60, // 5 phút
    });

    // Giữ nguyên refresh token cookie
    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: Math.floor((existingToken.expires_at.getTime() - Date.now()) / 1000),
    });

    return response;

  } catch (err) {
    console.log("withAuth error:", err);
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
}
