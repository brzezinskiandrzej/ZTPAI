
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../../models/User";
import { Song } from "../../models/Song";
import { Playlist } from "../../models/Playlist";
import { PlaylistSong } from "../../models/PlaylistSong";
import { LikedSong } from "../../models/LikedSong";
import { Artist } from "../../models/Artist";
const env = process.env.NODE_ENV ?? 'development';
const isProd = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === 'test';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: isTest
    ? 'postgres://user:password@localhost:5432/mydatabase_test'
    : process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mydatabase',

  // używamy tych samych encji w każdej konfiguracji
  entities: isProd
    ? [__dirname + '/../../models/*.js']      // prod = pliki .js w dist
    : [User, Song, Playlist, PlaylistSong, LikedSong, Artist],

  migrations: isProd
    ? [__dirname + '/../migrations/*.js']
    : ['src/database/migrations/*.ts'],

  /**
   * TEST ‑> budujemy schemat od zera przy każdym uruchomieniu,
   * PROD/DEV ‑> nic nie ruszamy, jedynie `migrationsRun`
   */
  synchronize : isTest,      // 🟢 test: true   🔴 prod/dev: false
  dropSchema  : isTest,      // 🟢 test: true   🔴 prod/dev: false
  migrationsRun: !isTest,    // w testach nie odpalaj migracji (bo i tak sync)
  logging: false
});


