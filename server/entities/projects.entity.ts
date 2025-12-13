import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("projects")
export class Projects {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "varchar", length: 100 })
  icon!: string;

  @Column({ type: "varchar", length: 100 })
  color!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "json", nullable: false })
  tags!: string[];

  @Column({ type: "varchar", length: 255, nullable: true })
  live_demo_url!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  git_url!: string | null;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;
}
