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
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../database/config/data-source");
const User_1 = require("../models/User");
const Playlist_1 = require("../models/Playlist");
const PlaylistSong_1 = require("../models/PlaylistSong");
const Song_1 = require("../models/Song");
const LikedSong_1 = require("../models/LikedSong");
const router = express_1.default.Router();
router.get("/playlist/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        console.log("Fetching playlist for user:", userId);
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepo.findOneBy({ user_id: +userId });
        console.log("User fetched:", user);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const playlistRepo = data_source_1.AppDataSource.getRepository(Playlist_1.Playlist);
        const playlist = yield playlistRepo.findOne({
            where: { owner: { user_id: +userId } },
            relations: ["owner", "playlistSongs"],
        });
        console.log("Playlist fetched:", playlist);
        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found for this user" });
        }
        const playlistSongRepo = data_source_1.AppDataSource.getRepository(PlaylistSong_1.PlaylistSong);
        const playlistSongs = yield playlistSongRepo.find({
            where: { playlist_id: playlist.playlist_id },
            relations: ["song"],
            order: { order_index: "ASC" }
        });
        console.log("Playlist songs fetched:", playlistSongs);
        const tracks = playlistSongs.map(ps => {
            var _a;
            const s = ps.song;
            return {
                id: s.song_id,
                title: s.title,
                artist: ((_a = s.artist) === null || _a === void 0 ? void 0 : _a.name) || "Unknown",
                artwork: s.artwork_url,
                playCount: s.play_count,
                duration: "",
                isFavorite: false,
                url: s.audio_url,
            };
        });
        console.log("Tracks prepared:", tracks);
        const likedSongRepo = data_source_1.AppDataSource.getRepository(LikedSong_1.LikedSong);
        const likedEntries = yield likedSongRepo.find({
            where: { user_id: +userId }
        });
        const likedSet = new Set(likedEntries.map(ls => ls.song_id));
        tracks.forEach(t => {
            if (likedSet.has(t.id)) {
                t.isFavorite = true;
            }
        });
        return res.status(200).json({
            username: user.username,
            playlistName: playlist.name,
            tracks
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}));
router.post("/tracks/:trackId/play", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { trackId } = req.params;
        const songRepo = data_source_1.AppDataSource.getRepository(Song_1.Song);
        const song = yield songRepo.findOneBy({ song_id: +trackId });
        if (!song) {
            return res.status(404).json({ error: "Track not found" });
        }
        song.play_count += 1;
        yield songRepo.save(song);
        return res.json({
            success: true,
            message: `Play count updated for track ${trackId}`,
            playCount: song.play_count
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}));
router.post("/tracks/:trackId/favorite", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { trackId } = req.params;
        const { isFavorite } = req.body;
        const userId = +(req.query.userId || 1);
        const songRepo = data_source_1.AppDataSource.getRepository(Song_1.Song);
        const song = yield songRepo.findOneBy({ song_id: +trackId });
        if (!song) {
            return res.status(404).json({ error: "Track not found" });
        }
        const likedSongRepo = data_source_1.AppDataSource.getRepository(LikedSong_1.LikedSong);
        if (isFavorite) {
            const exists = yield likedSongRepo.findOneBy({ user_id: userId, song_id: +trackId });
            if (!exists) {
                const newLike = likedSongRepo.create({
                    user_id: userId,
                    song_id: +trackId
                });
                yield likedSongRepo.save(newLike);
            }
            return res.json({
                success: true,
                message: `Track ${trackId} added to favorites`
            });
        }
        else {
            yield likedSongRepo.delete({ user_id: userId, song_id: +trackId });
            return res.json({
                success: true,
                message: `Track ${trackId} removed from favorites`
            });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}));
exports.default = router;
