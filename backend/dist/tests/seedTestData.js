"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTestData = void 0;
const data_source_1 = require("../src/database/config/data-source");
const User_1 = require("../src/models/User");
const Song_1 = require("../src/models/Song");
const Playlist_1 = require("../src/models/Playlist");
const PlaylistSong_1 = require("../src/models/PlaylistSong");
const seedTestData = () => __awaiter(void 0, void 0, void 0, function* () {
    const ds = data_source_1.AppDataSource;
    const user = ds.getRepository(User_1.User).create({
        username: 'TestUser',
        email: 'test@example.com',
        password_hash: 'hash',
    });
    yield ds.manager.save(user);
    const song = ds.getRepository(Song_1.Song).create({
        title: 'Test song',
        audio_url: 'https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3',
    });
    yield ds.manager.save(song);
    const playlist = ds.getRepository(Playlist_1.Playlist).create({
        name: 'Test playlist',
        owner: user,
    });
    yield ds.manager.save(playlist);
    yield ds.getRepository(PlaylistSong_1.PlaylistSong).save({
        playlist,
        song,
        order_index: 1,
    });
    return { user, song, playlist };
});
exports.seedTestData = seedTestData;
