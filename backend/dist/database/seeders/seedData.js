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
exports.seedData = void 0;
require("reflect-metadata");
const data_source_1 = require("../config/data-source");
const User_1 = require("../../models/User");
const Artist_1 = require("../../models/Artist");
const Song_1 = require("../../models/Song");
const Playlist_1 = require("../../models/Playlist");
const PlaylistSong_1 = require("../../models/PlaylistSong");
function seedData() {
    return __awaiter(this, void 0, void 0, function* () {
        yield data_source_1.AppDataSource.initialize();
        console.log("Data Source initialized... seeding data now.");
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const andrew = userRepo.create({
            username: "Andrew",
            email: "andrew@example.com",
            password_hash: "secret",
            role: "user",
        });
        yield userRepo.save(andrew);
        const barbara = userRepo.create({
            username: "Barbara",
            email: "barbara@example.com",
            password_hash: "secret",
            role: "user",
        });
        yield userRepo.save(barbara);
        const artistRepo = data_source_1.AppDataSource.getRepository(Artist_1.Artist);
        const coldplay = artistRepo.create({
            name: "Coldplay",
            bio: "Famous British rock band..."
        });
        yield artistRepo.save(coldplay);
        const edSheeran = artistRepo.create({
            name: "Ed Sheeran",
            bio: "English singer-songwriter..."
        });
        yield artistRepo.save(edSheeran);
        const songRepo = data_source_1.AppDataSource.getRepository(Song_1.Song);
        const s1 = songRepo.create({
            title: "Shiver",
            artwork_url: "https://placehold.co/40x40/607d8b/607d8b",
            play_count: 0,
            artist_id: coldplay.artist_id,
            audio_url: "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3"
        });
        yield songRepo.save(s1);
        const s2 = songRepo.create({
            title: "Yellow",
            artwork_url: "https://placehold.co/40x40/673ab7/673ab7",
            play_count: 0,
            artist_id: coldplay.artist_id,
            audio_url: "https://www.mfiles.co.uk/mp3-downloads/i-do-like-to-be-beside-the-seaside.mp3"
        });
        yield songRepo.save(s2);
        const s3 = songRepo.create({
            title: "The Scientist",
            artwork_url: "https://placehold.co/40x40/90a4ae/90a4ae",
            play_count: 0,
            artist_id: coldplay.artist_id,
            audio_url: "https://www.mfiles.co.uk/mp3-downloads/polly-perkins-of-paddington-green.mp3"
        });
        yield songRepo.save(s3);
        const s4 = songRepo.create({
            title: "Fix You",
            artwork_url: "https://placehold.co/40x40/f44336/f44336",
            play_count: 0,
            artist_id: coldplay.artist_id,
            audio_url: "https://www.mfiles.co.uk/mp3-downloads/the-man-who-broke-the-bank-at-monte-carlo.mp3"
        });
        yield songRepo.save(s4);
        const s5 = songRepo.create({
            title: "Viva La Vida",
            artwork_url: "https://placehold.co/40x40/eceff1/eceff1",
            play_count: 0,
            artist_id: coldplay.artist_id,
            audio_url: "https://www.mfiles.co.uk/mp3-downloads/its-a-long-long-way-to-tipperary.mp3"
        });
        yield songRepo.save(s5);
        const s6 = songRepo.create({
            title: "Perfect",
            artwork_url: "https://placehold.co/40x40/9c27b0/9c27b0",
            play_count: 0,
            artist_id: edSheeran.artist_id,
            audio_url: "https://www.mfiles.co.uk/mp3-downloads/lets-all-go-down-the-strand.mp3"
        });
        yield songRepo.save(s6);
        const playlistRepo = data_source_1.AppDataSource.getRepository(Playlist_1.Playlist);
        const p1 = playlistRepo.create({
            owner: andrew,
            name: "Your Today's Moody Playlist"
        });
        yield playlistRepo.save(p1);
        const psRepo = data_source_1.AppDataSource.getRepository(PlaylistSong_1.PlaylistSong);
        const trackIds = [s1.song_id, s2.song_id, s3.song_id, s4.song_id];
        let orderIndex = 0;
        for (const tid of trackIds) {
            const ps = psRepo.create({
                playlist_id: p1.playlist_id,
                song_id: tid,
                order_index: orderIndex++
            });
            yield psRepo.save(ps);
        }
        const p2 = playlistRepo.create({
            owner: barbara,
            name: "Your Thursday's Happy Playlist"
        });
        yield playlistRepo.save(p2);
        const trackIds2 = [s2.song_id, s3.song_id, s5.song_id, s6.song_id];
        orderIndex = 0;
        for (const tid of trackIds2) {
            const ps = psRepo.create({
                playlist_id: p2.playlist_id,
                song_id: tid,
                order_index: orderIndex++
            });
            yield psRepo.save(ps);
        }
        console.log("Seeding done!");
        yield data_source_1.AppDataSource.destroy();
    });
}
exports.seedData = seedData;
if (require.main === module) {
    seedData().catch(err => console.error(err));
}
