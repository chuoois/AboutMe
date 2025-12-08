import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("skills")
export class Skill {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  category!: string;

  @Column({ type: "varchar", length: 255 })
  skill_name!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  icon!: string | null;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;
}
