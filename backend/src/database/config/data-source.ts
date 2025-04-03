
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../../models/User";
import { Song } from "../../models/Song";
import { Playlist } from "../../models/Playlist";
import { PlaylistSong } from "../../models/PlaylistSong";
import { LikedSong } from "../../models/LikedSong";
import { Artist } from "../../models/Artist";
const isProd = process.env.NODE_ENV === "production";


export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL || "postgres://user:password@db:5432/mydatabase",
  entities: isProd
    ? [__dirname + "/../../models/*.js"]
    : [User, Song, Playlist, PlaylistSong, LikedSong, Artist],
  migrations: isProd
    ? [__dirname + "/../migrations/*.js"]
    : ["src/database/migrations/*.ts"],
  synchronize: false,
  logging: false,
});


