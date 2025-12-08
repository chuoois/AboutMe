import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("repos")
export class Repo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "varchar", length: 100 })
  icon: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "json", nullable: false })
  tags: string[];

  @Column({ type: "varchar", length: 100, nullable: true })
  title_color: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  filename: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  live_demo_url: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  git_url: string | null;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
}
