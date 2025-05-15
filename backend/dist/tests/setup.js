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
exports.fixtures = void 0;
// tests/setup.ts
const data_source_1 = require("../src/database/config/data-source");
const User_1 = require("../src/models/User");
const Playlist_1 = require("../src/models/Playlist");
const Song_1 = require("../src/models/Song");
const PlaylistSong_1 = require("../src/models/PlaylistSong");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // 1. inicjalizacja
    yield data_source_1.AppDataSource.initialize();
    yield data_source_1.AppDataSource.synchronize(true); // czyści schemat testowy
    // 2. seed
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const songRepo = data_source_1.AppDataSource.getRepository(Song_1.Song);
    const plRepo = data_source_1.AppDataSource.getRepository(Playlist_1.Playlist);
    const psRepo = data_source_1.AppDataSource.getRepository(PlaylistSong_1.PlaylistSong);
    const user = yield userRepo.save(userRepo.create({
        username: "TestUser",
        email: "test@example.com",
        password_hash: "hash"
    }));
    const song = yield songRepo.save(songRepo.create({
        title: "Test song",
        audio_url: "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3"
    }));
    const playlist = yield plRepo.save(plRepo.create({
        name: "Test playlist",
        owner: user
    }));
    yield psRepo.save(psRepo.create({
        playlist,
        song,
        order_index: 1
    }));
    exports.fixtures = { user, song }; // ← udostępniamy testom
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield data_source_1.AppDataSource.destroy();
}));
