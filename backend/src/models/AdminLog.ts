import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("admin_logs")
export class AdminLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "actor_id" })
  actor!: User | null;                

  @Column({ length: 32 })
  action!: string;             

  @Column({ type: "int", nullable: true })
  targetId!: number | null;  
  
  @Column({ type: "jsonb", nullable: true })
  meta!: Record<string, any> | null;

  @CreateDateColumn()
  created_at!: Date;
}
