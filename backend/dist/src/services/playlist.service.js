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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFavorite = exports.incrementPlay = exports.getUserPlaylist = void 0;
// src/services/playlist.service.ts
const data_source_1 = require("../database/config/data-source");
const User_1 = require("../models/User");
const Playlist_1 = require("../models/Playlist");
const AppError_1 = __importDefault(require("../middlewares/AppError"));
const Song_1 = require("../models/Song");
const LikedSong_1 = require("../models/LikedSong");
function getUserPlaylist(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepo.findOneBy({ user_id: userId });
        if (!user)
            throw new AppError_1.default(404, "User not found");
        const playlistRepo = data_source_1.AppDataSource.getRepository(Playlist_1.Playlist);
        const playlist = yield playlistRepo.findOne({
            where: { owner: { user_id: userId } },
            relations: ["playlistSongs", "playlistSongs.song", "playlistSongs.song.artist"],
        });
        if (!playlist)
            throw new AppError_1.default(404, "Playlist not found for this user");
        const tracks = playlist.playlistSongs
            .sort((a, b) => a.order_index - b.order_index)
            .map((ps) => {
            var _a, _b;
            return ({
                id: ps.song.song_id,
                title: ps.song.title,
                artist: (_b = (_a = ps.song.artist) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "Unknown",
                artwork: ps.song.artwork_url,
                playCount: ps.song.play_count,
                duration: "",
                isFavorite: false,
                url: ps.song.audio_url,
            });
        });
        return { username: user.username, playlistName: playlist.name, tracks };
    });
}
exports.getUserPlaylist = getUserPlaylist;
function incrementPlay(trackId) {
    return __awaiter(this, void 0, void 0, function* () {
        const songRepo = data_source_1.AppDataSource.getRepository(Song_1.Song);
        const song = yield songRepo.findOneBy({ song_id: trackId });
        if (!song)
            throw new AppError_1.default(404, "Track not found");
        song.play_count += 1;
        yield songRepo.save(song);
        return { playCount: song.play_count }; //  ← to właśnie test sprawdza
    });
}
exports.incrementPlay = incrementPlay;
function toggleFavorite(userId, trackId, isFavorite) {
    return __awaiter(this, void 0, void 0, function* () {
        const songRepo = data_source_1.AppDataSource.getRepository(Song_1.Song);
        const likeRepo = data_source_1.AppDataSource.getRepository(LikedSong_1.LikedSong);
        const song = yield songRepo.findOneBy({ song_id: trackId });
        if (!song)
            throw new AppError_1.default(404, "Track not found");
        if (isFavorite) {
            const exists = yield likeRepo.findOneBy({ user_id: userId, song_id: trackId });
            if (!exists) {
                yield likeRepo.save(likeRepo.create({ user_id: userId, song_id: trackId }));
            }
            /** ⬇⬇⬇ MUSI coś zwrócić */
            return { isFavorite: true };
        }
        yield likeRepo.delete({ user_id: userId, song_id: trackId });
        return { isFavorite: false };
    });
}
exports.toggleFavorite = toggleFavorite;
