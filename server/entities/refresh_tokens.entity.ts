import type { Admin } from "./admin.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";

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

  @ManyToOne("Admin", "refreshTokens", { onDelete: "CASCADE" })
  @JoinColumn({ name: "admin_id" })
  admin!: Admin;
}