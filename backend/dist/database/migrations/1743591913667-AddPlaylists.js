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
exports.AddPlaylists1743591913667 = void 0;
class AddPlaylists1743591913667 {
    constructor() {
        this.name = 'AddPlaylists1743591913667';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "liked_song" ("user_id" integer NOT NULL, "song_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userUserId" integer, "songSongId" integer, CONSTRAINT "PK_1705804be29225e85bcc3534b5d" PRIMARY KEY ("user_id", "song_id"))`);
            yield queryRunner.query(`CREATE TABLE "playlist_song" ("playlist_id" integer NOT NULL, "song_id" integer NOT NULL, "order_index" integer NOT NULL DEFAULT '0', "playlistPlaylistId" integer, "songSongId" integer, CONSTRAINT "PK_a55ad75ae3d2148e4057e393bf2" PRIMARY KEY ("playlist_id", "song_id"))`);
            yield queryRunner.query(`CREATE TABLE "playlists" ("playlist_id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "ownerUserId" integer NOT NULL, CONSTRAINT "PK_d44fd950fca1f672db64f855a59" PRIMARY KEY ("playlist_id"))`);
            yield queryRunner.query(`ALTER TABLE "liked_song" ADD CONSTRAINT "FK_159132dbc3aa58a49328046f7c1" FOREIGN KEY ("userUserId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "liked_song" ADD CONSTRAINT "FK_4e76593c04f48f504100a8433d9" FOREIGN KEY ("songSongId") REFERENCES "songs"("song_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "playlist_song" ADD CONSTRAINT "FK_639488664fbc74f43f88242009c" FOREIGN KEY ("playlistPlaylistId") REFERENCES "playlists"("playlist_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "playlist_song" ADD CONSTRAINT "FK_ae5cfaa37e44e511e3d77eb7c44" FOREIGN KEY ("songSongId") REFERENCES "songs"("song_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "playlists" ADD CONSTRAINT "FK_ea5063483085661926687b8f38e" FOREIGN KEY ("ownerUserId") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "playlists" DROP CONSTRAINT "FK_ea5063483085661926687b8f38e"`);
            yield queryRunner.query(`ALTER TABLE "playlist_song" DROP CONSTRAINT "FK_ae5cfaa37e44e511e3d77eb7c44"`);
            yield queryRunner.query(`ALTER TABLE "playlist_song" DROP CONSTRAINT "FK_639488664fbc74f43f88242009c"`);
            yield queryRunner.query(`ALTER TABLE "liked_song" DROP CONSTRAINT "FK_4e76593c04f48f504100a8433d9"`);
            yield queryRunner.query(`ALTER TABLE "liked_song" DROP CONSTRAINT "FK_159132dbc3aa58a49328046f7c1"`);
            yield queryRunner.query(`DROP TABLE "playlists"`);
            yield queryRunner.query(`DROP TABLE "playlist_song"`);
            yield queryRunner.query(`DROP TABLE "liked_song"`);
        });
    }
}
exports.AddPlaylists1743591913667 = AddPlaylists1743591913667;
