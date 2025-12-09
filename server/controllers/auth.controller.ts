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
        return await dataSource.transaction(async (manager) => {
          const tokens = await generateTokens(admin.id, admin.email, manager);
          return { status: "LOGIN_SUCCESS", ...tokens };
        });
      }
    }
    
    // B3: Nếu không tin cậy -> Gửi OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
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
    
    return await dataSource.transaction(async (manager) => {
      // 1. Xóa OTP đã dùng
      await manager.remove(validOtp);
      
      let newDeviceToken = null;
      
      // 2. Xử lý Remember Me (Tạo Device Token)
      if (rememberMe) {
        newDeviceToken = uuidv4();
        const device = manager.create(TrustedDevice, {
          adminId: admin.id,
          device_token: newDeviceToken,
          user_agent: userAgent,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 ngày
        });
        await manager.save(device);
      }
      
      // 3. Tạo Tokens (Access + Refresh)
      const tokens = await generateTokens(admin.id, admin.email, manager);

      return {
        status: "LOGIN_SUCCESS",
        ...tokens, // Chứa accessToken, refreshToken
        deviceToken: newDeviceToken 
      };
    });
  },

  // ==========================================
  // 3. REFRESH TOKEN
  // ==========================================
  refreshToken: async (oldRefreshToken: string) => {
    const dataSource = await getDataSource();
    
    try {
      verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET!);
    } catch (err) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }
    
    return await dataSource.transaction(async (manager) => {
      const rtRepo = manager.getRepository(RefreshToken);
      
      const existingToken = await rtRepo.findOne({
        where: { token: oldRefreshToken },
        relations: ["admin"]
      });
      
      if (!existingToken) throw new Error("TOKEN_REVOKED");
      
      if (existingToken.expires_at < new Date()) {
        await manager.remove(existingToken);
        throw new Error("REFRESH_TOKEN_EXPIRED");
      }
      
      // Token Rotation: Xóa cũ, cấp mới
      await manager.remove(existingToken); 
      const tokens = await generateTokens(existingToken.admin.id, existingToken.admin.email, manager);
      
      return { status: "LOGIN_SUCCESS", ...tokens };
    });
  },

  // ==========================================
  // 4. LOGOUT
  // ==========================================
  logout: async (refreshToken?: string, deviceToken?: string) => {
    const dataSource = await getDataSource();
    await dataSource.transaction(async (manager) => {
      if (refreshToken) {
        await manager.delete(RefreshToken, { token: refreshToken });
      }
      // Tùy chọn: Không nhất thiết phải xóa deviceToken khi logout, trừ khi user muốn "Quên thiết bị này"
      // if (deviceToken) {
      //   await manager.delete(TrustedDevice, { device_token: deviceToken });
      // }
    });
    return { message: "Logged out" };
  }
};