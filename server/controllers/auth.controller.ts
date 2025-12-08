import { getDataSource } from "@/server/db/connection";
import { Admin } from "@/server/entities/admin.entity";
import { OtpCode } from "@/server/entities/otp_codes.entity";
import { RefreshToken } from "@/server/entities/refresh_tokens.entity";
import { TrustedDevice } from "@/server/entities/trusted_devices.entity";
import { MoreThan } from "typeorm";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { verify } from "jsonwebtoken";
import { sendOtpEmail } from "@/server/config/mailer.config";
import { generateTokens } from "@/server/utils/jwt";

export const AuthController = {

  // ==========================================
  // 1. LOGIN
  // ==========================================
  login: async (email: string, password: string, deviceTokenFromCookie?: string) => {
    const dataSource = await getDataSource();
    const adminRepo = dataSource.getRepository(Admin);
    const trustedRepo = dataSource.getRepository(TrustedDevice);
    // B1: Validate email/password
    const admin = await adminRepo.findOne({ where: { email } });
    if (!admin) throw new Error("USER_NOT_FOUND");
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new Error("INVALID_PASSWORD");
    // B2: Check "Remember Me" qua Device Token (Cookie)
    if (deviceTokenFromCookie) {
      const trustedDevice = await trustedRepo.findOne({
        where: {
          device_token: deviceTokenFromCookie,
          adminId: admin.id,
          expires_at: MoreThan(new Date())
        }
      });
      // Nếu thiết bị tin cậy -> Bỏ qua OTP -> Cấp token luôn
      if (trustedDevice) {
        // Dùng transaction để tạo token an toàn
        return await dataSource.transaction(async (manager) => {
          const tokens = await generateTokens(admin.id, admin.email, manager);
          return { status: "LOGIN_SUCCESS", ...tokens };
        });
      }
    }
    // B3: Nếu không tin cậy -> Gửi OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // Transaction: Xóa OTP cũ + Lưu OTP mới
    await dataSource.transaction(async (manager) => {
      await manager.delete(OtpCode, { adminId: admin.id }); // Xóa rác
      const otp = manager.create(OtpCode, {
        adminId: admin.id,
        code,
        expires_at: new Date(Date.now() + 5 * 60000), // 5 phút
      });
      await manager.save(otp);
    });
    await sendOtpEmail(email, code);
    return { status: "OTP_SENT", email };
  },

  // ==========================================
  // 2. VERIFY OTP
  // ==========================================
  verifyOtp: async (email: string, code: string, rememberMe: boolean, userAgent: string) => {
    const dataSource = await getDataSource();
    const adminRepo = dataSource.getRepository(Admin);
    const otpRepo = dataSource.getRepository(OtpCode);
    const admin = await adminRepo.findOne({ where: { email } });
    if (!admin) throw new Error("USER_NOT_FOUND");
    // Check OTP
    const validOtp = await otpRepo.findOne({
      where: {
        adminId: admin.id,
        code,
        expires_at: MoreThan(new Date())
      }
    });
    if (!validOtp) throw new Error("INVALID_OTP");
    // Transaction: Xóa OTP -> (Lưu Trusted Device) -> Lưu Tokens
    return await dataSource.transaction(async (manager) => {
      // 1. Xóa OTP đã dùng
      await manager.remove(validOtp);
      let newDeviceToken = null;
      // 2. Xử lý Remember Me
      if (rememberMe) {
        newDeviceToken = uuidv4(); // Tạo mã định danh thiết bị (UUID)
        const device = manager.create(TrustedDevice, {
          adminId: admin.id,
          device_token: newDeviceToken,
          user_agent: userAgent,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 ngày
        });
        await manager.save(device);
      }
      // 3. Tạo Tokens
      const tokens = await generateTokens(admin.id, admin.email, manager);

      return {
        ...tokens,
        deviceToken: newDeviceToken // Trả về để set vào Cookie
      };
    });
  },
  
  // ==========================================
  // 3. REFRESH TOKEN (Token Rotation)
  // ==========================================
  refreshToken: async (oldRefreshToken: string) => {
    const dataSource = await getDataSource();
    // B1: Verify JWT Signature
    let payload: any;
    try {
      payload = verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET!);
    } catch (err) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }
    return await dataSource.transaction(async (manager) => {
      const rtRepo = manager.getRepository(RefreshToken);
      // B2: Tìm trong DB
      const existingToken = await rtRepo.findOne({
        where: { token: oldRefreshToken },
        relations: ["admin"]
      });
      // Nếu token hợp lệ signature nhưng không có trong DB -> Có thể đã bị hacker dùng trước -> Nguy hiểm!
      if (!existingToken) {
        // (Nâng cao: Có thể xóa toàn bộ token của user này để ép đăng nhập lại)
        throw new Error("TOKEN_REVOKED");
      }
      // B3: Check hết hạn
      if (existingToken.expires_at < new Date()) {
        await manager.remove(existingToken);
        throw new Error("REFRESH_TOKEN_EXPIRED");
      }
      // B4: ROTATION - Xóa cái cũ, cấp cái mới
      await manager.remove(existingToken);
      // B5: Cấp cặp token mới
      return await generateTokens(existingToken.admin.id, existingToken.admin.email, manager);
    });
  },

  // ==========================================
  // 4. LOGOUT (Optional)
  // ==========================================
  logout: async (refreshToken: string, deviceToken?: string) => {
    const dataSource = await getDataSource();
    await dataSource.transaction(async (manager) => {
      // Xóa refresh token
      await manager.delete(RefreshToken, { token: refreshToken });
      // Xóa trusted device nếu muốn logout hoàn toàn khỏi thiết bị này
      if (deviceToken) {
        await manager.delete(TrustedDevice, { device_token: deviceToken });
      }
    });
    return { message: "Logged out" };
  }
};