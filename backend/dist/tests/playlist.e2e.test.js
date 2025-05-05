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
describe('Playlist endpoints', () => {
    it('GET zwraca playlistę', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(setup_1.app)
            .get(`/api/playlist/${setup_1.fixtures.user.user_id}`)
            .expect(200);
        expect(res.body.username).toBe('TestUser');
    }));
    it('POST play inkrementuje licznik', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(setup_1.app)
            .post(`/api/tracks/${setup_1.fixtures.song.song_id}/play`)
            .expect(200);
        expect(res.body.playCount).toBe(1);
    }));
});
