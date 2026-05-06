import type { Admin } from "./admin.entity"; 
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
@Entity("otp_codes")
export class OtpCode {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "admin_id" })
  adminId!: number;

  @Column({ type: "varchar", length: 10 })
  code!: string;

  @Column({ type: "datetime" })
  expires_at!: Date;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne("Admin", "otps", { onDelete: "CASCADE" })
  @JoinColumn({ name: "admin_id" })
  admin!: Admin; 
}