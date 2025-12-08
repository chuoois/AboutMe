import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Admin } from "./admin.entity";

@Entity("trusted_devices")
export class TrustedDevice {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "admin_id" })
  adminId!: number;

  @Column({ type: "varchar", length: 255, unique: true })
  device_token!: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  user_agent!: string;

  @Column({ type: "datetime" })
  expires_at!: Date;

  @CreateDateColumn()
  created_at!: Date;

  // --- SỬA Ở ĐÂY ---
  @ManyToOne(() => Admin, (admin) => admin.trustedDevices, { onDelete: "CASCADE" })
  @JoinColumn({ name: "admin_id" })
  admin!: any; // Đổi thành any
}