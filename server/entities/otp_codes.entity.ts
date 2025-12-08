import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Admin } from "./admin.entity"; 

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

  // --- SỬA Ở ĐÂY ---
  // Giữ nguyên decorator, nó dùng lazy function () => Admin nên an toàn
  @ManyToOne(() => Admin, (admin) => admin.otps, { onDelete: "CASCADE" })
  @JoinColumn({ name: "admin_id" })
  // Thay đổi 'admin!: Admin' thành 'admin!: any' 
  // Điều này ngăn TypeScript emit metadata gây lỗi ReferenceError
  admin!: any; 
}