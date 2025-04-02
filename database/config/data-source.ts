
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../../backend/src/models/User";
import { Song } from "../../backend/src/models/Song";
import { Playlist } from "../../backend/src/models/Playlist";
import { PlaylistSong } from "../../backend/src/models/PlaylistSong";
import { LikedSong } from "../../backend/src/models/LikedSong";



export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL || "postgres://user:password@localhost:5432/mydatabase",
  entities: [User,Song,Playlist,PlaylistSong,LikedSong],
  migrations: ["../database/migrations/*.ts"],
  synchronize: true
});


