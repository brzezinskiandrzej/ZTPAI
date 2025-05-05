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
exports.AddArtistToSongRelation1743612795416 = void 0;
class AddArtistToSongRelation1743612795416 {
    constructor() {
        this.name = 'AddArtistToSongRelation1743612795416';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "songs" ADD CONSTRAINT "FK_999ba7dd3c94dd5f9649944a5c6" FOREIGN KEY ("artist_id") REFERENCES "artists"("artist_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "songs" DROP CONSTRAINT "FK_999ba7dd3c94dd5f9649944a5c6"`);
        });
    }
}
exports.AddArtistToSongRelation1743612795416 = AddArtistToSongRelation1743612795416;
