
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../../models/User";
import { Song } from "../../models/Song";
import { Playlist } from "../../models/Playlist";
import { PlaylistSong } from "../../models/PlaylistSong";
import { LikedSong } from "../../models/LikedSong";
import { Artist } from "../../models/Artist";



export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL || "postgres://user:password@localhost:5432/mydatabase",
  entities: [User,Song,Playlist,PlaylistSong,LikedSong,Artist],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: true
});


