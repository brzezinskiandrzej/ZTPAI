import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
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
  playlist!: Playlist;

  @ManyToOne(() => Song, { onDelete: "CASCADE" })
  song!: Song;
}
