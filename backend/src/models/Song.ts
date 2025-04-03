import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn} from "typeorm";
import { User } from "./User";
import { Artist } from "./Artist";

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

    @ManyToOne(() => Artist, { nullable: true })
    @JoinColumn({ name: "artist_id" })
    artist?: Artist;

    @CreateDateColumn({ type: "timestamp" })
    uploaded_at!: Date;
    
    @Column({ nullable: true })
    audio_url?: string;
  }
