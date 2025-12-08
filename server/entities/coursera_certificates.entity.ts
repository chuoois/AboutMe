import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("coursera_certificates")
export class CourseraCertificate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  coursera_name!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  specialization!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  icon!: string | null;

  @Column({ type: "varchar", length: 100, default: "Coursera" })
  issuer!: string;

  @Column({ type: "date" })
  issue_date!: Date;

  @Column({ type: "varchar", length: 500, nullable: true })
  credential_url!: string | null;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;
}
