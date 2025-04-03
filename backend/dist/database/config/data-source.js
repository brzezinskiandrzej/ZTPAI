"use strict";
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
const isProd = process.env.NODE_ENV === "production";
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL || "postgres://user:password@db:5432/mydatabase",
    // W trybie produkcyjnym (po kompilacji) encje znajdują się w dist/models/*.js,
    // a w dev (ts-node) korzystamy z bezpośrednich importów.
    entities: isProd
        ? [__dirname + "/../../models/*.js"]
        : [User_1.User, Song_1.Song, Playlist_1.Playlist, PlaylistSong_1.PlaylistSong, LikedSong_1.LikedSong, Artist_1.Artist],
    migrations: isProd
        ? [__dirname + "/../migrations/*.js"]
        : ["src/database/migrations/*.ts"],
    synchronize: false,
    logging: false,
});
