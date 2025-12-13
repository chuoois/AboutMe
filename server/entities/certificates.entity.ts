  import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
  } from "typeorm";

  @Entity("certificates")
  export class Certificate {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    coursera_name!: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    specialization!: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    icon!: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    color!: string;

    @Column({ type: "varchar", length: 100, default: "Coursera" })
    issuer!: string;

    @Column({ type: "date", nullable: false })
    issue_date!: Date;

    @Column({ type: "varchar", length: 500})
    credential_url!: string | null;

    @Column({ type: "text", nullable: true })
    description!: string | null;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;
  }
