import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Admin } from "./admin.entity";

@Entity("refresh_tokens")
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "admin_id" })
  adminId!: number;

  @Column({ type: "varchar", length: 500 })
  token!: string;

  @Column({ type: "datetime" })
  expires_at!: Date;

  @CreateDateColumn()
  created_at!: Date;

  // --- SỬA Ở ĐÂY ---
  @ManyToOne(() => Admin, (admin) => admin.refreshTokens, { onDelete: "CASCADE" })
  @JoinColumn({ name: "admin_id" })
  admin!: any; // Đổi thành any để tránh lỗi Circular Dependency
}