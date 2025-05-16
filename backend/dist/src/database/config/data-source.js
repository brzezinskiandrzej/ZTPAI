"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("../../models/User");
const Song_1 = require("../../models/Song");
const Playlist_1 = require("../../models/Playlist");
const PlaylistSong_1 = require("../../models/PlaylistSong");
const LikedSong_1 = require("../../models/LikedSong");
const Artist_1 = require("../../models/Artist");
const env = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : 'development';
const isProd = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === 'test';
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: isTest
        ? 'postgres://user:password@localhost:5432/mydatabase_test'
        : process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mydatabase',
    // używamy tych samych encji w każdej konfiguracji
    entities: isProd
        ? [__dirname + '/../../models/*.js'] // prod = pliki .js w dist
        : [User_1.User, Song_1.Song, Playlist_1.Playlist, PlaylistSong_1.PlaylistSong, LikedSong_1.LikedSong, Artist_1.Artist],
    migrations: isProd
        ? [__dirname + '/../migrations/*.js']
        : ['src/database/migrations/*.ts'],
    /**
     * TEST ‑> budujemy schemat od zera przy każdym uruchomieniu,
     * PROD/DEV ‑> nic nie ruszamy, jedynie `migrationsRun`
     */
    synchronize: isTest,
    dropSchema: isTest,
    migrationsRun: !isTest,
    logging: false
});
