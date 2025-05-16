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
exports.AddRelationstoPlaylistSongandLikedSong1743616980148 = void 0;
class AddRelationstoPlaylistSongandLikedSong1743616980148 {
    constructor() {
        this.name = 'AddRelationstoPlaylistSongandLikedSong1743616980148';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "liked_song" DROP CONSTRAINT "FK_159132dbc3aa58a49328046f7c1"`);
            yield queryRunner.query(`ALTER TABLE "liked_song" DROP CONSTRAINT "FK_4e76593c04f48f504100a8433d9"`);
            yield queryRunner.query(`ALTER TABLE "playlist_song" DROP CONSTRAINT "FK_639488664fbc74f43f88242009c"`);
            yield queryRunner.query(`ALTER TABLE "playlist_song" DROP CONSTRAINT "FK_ae5cfaa37e44e511e3d77eb7c44"`);
            yield queryRunner.query(`ALTER TABLE "liked_song" DROP COLUMN "userUserId"`);
            yield queryRunner.query(`ALTER TABLE "liked_song" DROP COLUMN "songSongId"`);
            yield queryRunner.query(`ALTER TABLE "playlist_song" DROP COLUMN "playlistPlaylistId"`);
            yield queryRunner.query(`ALTER TABLE "playlist_song" DROP COLUMN "songSongId"`);
            yield queryRunner.query(`ALTER TABLE "liked_song" ADD CONSTRAINT "FK_6014cf3799b4bc29d3fb5cb0b31" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "liked_song" ADD CONSTRAINT "FK_1cc5d3d93f0cc7f12ba0046df05" FOREIGN KEY ("song_id") REFERENCES "songs"("song_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "playlist_song" ADD CONSTRAINT "FK_404e93f5821bb1475c17b08882a" FOREIGN KEY ("playlist_id") REFERENCES "playlists"("playlist_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "playlist_song" ADD CONSTRAINT "FK_bf47d280a95a3528ff259743005" FOREIGN KEY ("song_id") REFERENCES "songs"("song_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "playlist_song" DROP CONSTRAINT "FK_bf47d280a95a3528ff259743005"`);
            yield queryRunner.query(`ALTER TABLE "playlist_song" DROP CONSTRAINT "FK_404e93f5821bb1475c17b08882a"`);
            yield queryRunner.query(`ALTER TABLE "liked_song" DROP CONSTRAINT "FK_1cc5d3d93f0cc7f12ba0046df05"`);
            yield queryRunner.query(`ALTER TABLE "liked_song" DROP CONSTRAINT "FK_6014cf3799b4bc29d3fb5cb0b31"`);
            yield queryRunner.query(`ALTER TABLE "playlist_song" ADD "songSongId" integer`);
            yield queryRunner.query(`ALTER TABLE "playlist_song" ADD "playlistPlaylistId" integer`);
            yield queryRunner.query(`ALTER TABLE "liked_song" ADD "songSongId" integer`);
            yield queryRunner.query(`ALTER TABLE "liked_song" ADD "userUserId" integer`);
            yield queryRunner.query(`ALTER TABLE "playlist_song" ADD CONSTRAINT "FK_ae5cfaa37e44e511e3d77eb7c44" FOREIGN KEY ("songSongId") REFERENCES "songs"("song_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "playlist_song" ADD CONSTRAINT "FK_639488664fbc74f43f88242009c" FOREIGN KEY ("playlistPlaylistId") REFERENCES "playlists"("playlist_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "liked_song" ADD CONSTRAINT "FK_4e76593c04f48f504100a8433d9" FOREIGN KEY ("songSongId") REFERENCES "songs"("song_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "liked_song" ADD CONSTRAINT "FK_159132dbc3aa58a49328046f7c1" FOREIGN KEY ("userUserId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
}
exports.AddRelationstoPlaylistSongandLikedSong1743616980148 = AddRelationstoPlaylistSongandLikedSong1743616980148;
