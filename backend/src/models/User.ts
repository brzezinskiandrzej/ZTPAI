import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    user_id!: number;
  
    @Column({ unique: true })
    username!: string;  
  
    @Column({ unique: true })
    email!: string;
  
    @Column()
    password_hash!: string;
  
    @Column({ default: "user" })
    role!: string;   // 'user' | 'admin' | 'artist'
  
    @Column({ nullable: true })
    avatar_url?: string; // pole na link do zdjęcia konta
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  }
