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
const supertest_1 = __importDefault(require("supertest"));
const setup_1 = require("./setup");
const app_1 = require("../src/app");
const data_source_1 = require("../src/database/config/data-source");
const LikedSong_1 = require("../src/models/LikedSong");
describe('Playlist endpoints', () => {
    it("GET zwraca playlistę 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .get(`/api/playlist/${setup_1.fixtures.user.user_id}`)
            .expect(200);
        expect(res.body.username).toBe(setup_1.fixtures.user.username);
        expect(res.body.tracks).toHaveLength(1);
    }));
    it("POST play inkrementuje play_count", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .post(`/api/tracks/${setup_1.fixtures.song.song_id}/play`)
            .expect(200)
            .expect(res => {
            expect(res.body.playCount).toBe(1);
        });
    }));
    it("GET z nienumerycznym userId → 400", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).get("/api/playlist/abc").expect(400);
    }));
    it("GET 404 dla nieistniejącego usera", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).get("/api/playlist/9999").expect(404);
    }));
    it("POST favorite z nienumerycznym trackId → 400", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .post("/api/tracks/abc/favorite")
            .send({ isFavorite: true })
            .expect(400);
    }));
    it("dodaje i usuwa polubienie", () => __awaiter(void 0, void 0, void 0, function* () {
        // ➕ dodajemy
        yield (0, supertest_1.default)(app_1.app)
            .post(`/api/tracks/${setup_1.fixtures.song.song_id}/favorite?userId=${setup_1.fixtures.user.user_id}`)
            .send({ isFavorite: true })
            .expect(201);
        const likeRepo = data_source_1.AppDataSource.getRepository(LikedSong_1.LikedSong);
        expect(yield likeRepo.findOneBy({
            user_id: setup_1.fixtures.user.user_id,
            song_id: setup_1.fixtures.song.song_id,
        })).not.toBeNull();
        // ➖ usuwamy
        yield (0, supertest_1.default)(app_1.app)
            .post(`/api/tracks/${setup_1.fixtures.song.song_id}/favorite?userId=${setup_1.fixtures.user.user_id}`)
            .send({ isFavorite: false })
            .expect(200);
        expect(yield likeRepo.findOneBy({
            user_id: setup_1.fixtures.user.user_id,
            song_id: setup_1.fixtures.song.song_id,
        })).toBeNull();
    }));
    it("zwraca 404 dla nieistniejącego utworu", () => __awaiter(void 0, void 0, void 0, function* () {
        const missingId = setup_1.fixtures.song.song_id + 1000;
        yield (0, supertest_1.default)(app_1.app)
            .post(`/api/tracks/${missingId}/favorite?userId=1`)
            .send({ isFavorite: true })
            .expect(404);
    }));
    it("zwraca 422 gdy isFavorite nie jest booleanem", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .post(`/api/tracks/${setup_1.fixtures.song.song_id}/favorite?userId=1`)
            .send({ isFavorite: "yes" })
            .expect(422);
    }));
});
