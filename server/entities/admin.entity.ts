import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { OtpCode } from "./otp_codes.entity";
import { RefreshToken } from "./refresh_tokens.entity";
import { TrustedDevice } from "./trusted_devices.entity";

@Entity("admins")
export class Admin {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @CreateDateColumn()
  created_at!: Date;

  // Relations
  @OneToMany(() => OtpCode, (otp) => otp.admin)
  otps!: OtpCode[];

  @OneToMany(() => RefreshToken, (token) => token.admin)
  refreshTokens!: RefreshToken[];

  @OneToMany(() => TrustedDevice, (device) => device.admin)
  trustedDevices!: TrustedDevice[];
}