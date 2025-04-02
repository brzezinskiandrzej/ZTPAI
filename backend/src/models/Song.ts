import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn} from "typeorm";
import { User } from "./User";

@Entity('songs')
export class Song {
    @PrimaryGeneratedColumn()
    song_id!: number;
  
    @Column()
    title!: string;  
  
    @Column({ nullable: true })
    artwork_url?: string;
  
    @Column({ default: 0 })
    play_count!: number;
  
    @Column({ nullable: true })
    artist_id?: number;

    @CreateDateColumn({ type: "timestamp" })
    uploaded_at!: Date;
  }
