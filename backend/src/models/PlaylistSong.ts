import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Playlist } from "./Playlist";
import { Song } from "./Song";

@Entity("playlist_song")
export class PlaylistSong {
  @PrimaryColumn()
  playlist_id!: number;

  @PrimaryColumn()
  song_id!: number;

  @Column({ type: "int", default: 0 })
  order_index!: number;

  @ManyToOne(() => Playlist, playlist => playlist.playlistSongs, { onDelete: "CASCADE" })
  @JoinColumn({ name: "playlist_id" })
  playlist!: Playlist;

  @ManyToOne(() => Song, { onDelete: "CASCADE" })
  @JoinColumn({ name: "song_id" }) 
  song!: Song;
}
