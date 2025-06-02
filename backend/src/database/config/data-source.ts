
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../../models/User";
import { Song } from "../../models/Song";
import { Playlist } from "../../models/Playlist";
import { PlaylistSong } from "../../models/PlaylistSong";
import { LikedSong } from "../../models/LikedSong";
import { Artist } from "../../models/Artist";
import { AdminLog } from "../../models/AdminLog";
const env = process.env.NODE_ENV ?? 'development';
const isProd = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === 'test';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: isTest
    ? 'postgres://user:password@localhost:5432/mydatabase_test'
    : process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mydatabase',


  entities: isProd
    ? [__dirname + '/../../models/*.js']     
    : [User, Song, Playlist, PlaylistSong, LikedSong, Artist, AdminLog],

  migrations: isProd
    ? [__dirname + '/../migrations/*.js']
    : ['src/database/migrations/*.ts'],

  
  synchronize : isTest,     
  dropSchema  : isTest,      
  migrationsRun: !isTest,  
  logging: false
});


