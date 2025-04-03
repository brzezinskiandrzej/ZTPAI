import { Entity, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Song } from "./Song";

@Entity("liked_song")
export class LikedSong {
  @PrimaryColumn()
  user_id!: number;

  @PrimaryColumn()
  song_id!: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @ManyToOne(() => User, user => user.likedSongs, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Song, { onDelete: "CASCADE" })
  @JoinColumn({ name: "song_id" })
  song!: Song;
}
