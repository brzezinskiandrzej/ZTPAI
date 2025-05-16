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
exports.AddArtist1743595132787 = void 0;
class AddArtist1743595132787 {
    constructor() {
        this.name = 'AddArtist1743595132787';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "artists" ("artist_id" SERIAL NOT NULL, "name" character varying NOT NULL, "bio" character varying, CONSTRAINT "PK_51fb94826a5db1782cefcad31a1" PRIMARY KEY ("artist_id"))`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE "artists"`);
        });
    }
}
exports.AddArtist1743595132787 = AddArtist1743595132787;
