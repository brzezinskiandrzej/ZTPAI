import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn} from "typeorm";
import { User } from "./User";
import { Artist } from "./Artist";

@Entity('songs')
export class Song {
    reload() {
        throw new Error('Method not implemented.');
    }
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

    @Column("float", { default: 0.5 })
    valence!: number;

    @Column("float", { default: 0.5 })
    energy!: number;

    @Column("int", { default: 120 })
    tempo!: number;

    @Column({ length: 4, default: "C" })
    musical_key!: string;

    @Column({ type: "varchar", length: 120 })
    genres!: string; 
  }
