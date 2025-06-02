import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("admin_logs")
export class AdminLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false })
  actor!: User;                

  @Column()
  action!: string;             

  @Column({ type: "int", nullable: true })
  targetId!: number | null;   

  @CreateDateColumn()
  created_at!: Date;
}
