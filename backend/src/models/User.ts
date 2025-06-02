import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { LikedSong } from "./LikedSong";
import { Playlist } from "./Playlist";

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
    avatar_url?: string; 
    
    @Column({ default: false })
    is_banned!: boolean;
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;

    @OneToMany(() => Playlist, playlist => playlist.owner)
    playlists!: Playlist[];

    @OneToMany(() => LikedSong, likedSong => likedSong.user)
    likedSongs!: LikedSong[];
  }
