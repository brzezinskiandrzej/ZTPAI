import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { PlaylistSong } from "./PlaylistSong";

@Entity("playlists")
export class Playlist {
  @PrimaryGeneratedColumn()
  playlist_id!: number;

  @ManyToOne(() => User, user => user.playlists, { nullable: false })
  owner!: User;

  @Column()
  name!: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @OneToMany(() => PlaylistSong, playlistSong => playlistSong.playlist)
  playlistSongs!: PlaylistSong[];
}
