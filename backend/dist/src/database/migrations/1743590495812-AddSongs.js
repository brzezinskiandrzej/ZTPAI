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
exports.AddSongs1743590495812 = void 0;
class AddSongs1743590495812 {
    constructor() {
        this.name = 'AddSongs1743590495812';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "songs" ("song_id" SERIAL NOT NULL, "title" character varying NOT NULL, "artwork_url" character varying, "play_count" integer NOT NULL DEFAULT '0', "artist_id" integer, "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2d6edad8a9d0148b88f54668ca2" PRIMARY KEY ("song_id"))`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE "songs"`);
        });
    }
}
exports.AddSongs1743590495812 = AddSongs1743590495812;
