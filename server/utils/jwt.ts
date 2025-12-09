import { sign } from "jsonwebtoken";
import { EntityManager } from "typeorm";
import { RefreshToken } from "@/server/entities/refresh_tokens.entity";

// Hàm tạo token có hỗ trợ Transaction (manager)
export const generateTokens = async (
  adminId: number, 
  email: string, 
  manager: EntityManager
) => {
  // 1. Tạo JWT Strings
  const accessToken = sign({ id: adminId, email }, process.env.JWT_SECRET!, { expiresIn: "15m" });
  const refreshToken = sign({ id: adminId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
  // 3. Lưu Refresh Token vào DB
  const rtEntity = manager.create(RefreshToken, {
    adminId: adminId,
    token: refreshToken,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
  });

  await manager.save(rtEntity);

  return { accessToken, refreshToken };
};