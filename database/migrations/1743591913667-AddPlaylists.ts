import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlaylists1743591913667 implements MigrationInterface {
    name = 'AddPlaylists1743591913667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "liked_song" ("user_id" integer NOT NULL, "song_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userUserId" integer, "songSongId" integer, CONSTRAINT "PK_1705804be29225e85bcc3534b5d" PRIMARY KEY ("user_id", "song_id"))`);
        await queryRunner.query(`CREATE TABLE "playlist_song" ("playlist_id" integer NOT NULL, "song_id" integer NOT NULL, "order_index" integer NOT NULL DEFAULT '0', "playlistPlaylistId" integer, "songSongId" integer, CONSTRAINT "PK_a55ad75ae3d2148e4057e393bf2" PRIMARY KEY ("playlist_id", "song_id"))`);
        await queryRunner.query(`CREATE TABLE "playlists" ("playlist_id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "ownerUserId" integer NOT NULL, CONSTRAINT "PK_d44fd950fca1f672db64f855a59" PRIMARY KEY ("playlist_id"))`);
        await queryRunner.query(`ALTER TABLE "liked_song" ADD CONSTRAINT "FK_159132dbc3aa58a49328046f7c1" FOREIGN KEY ("userUserId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "liked_song" ADD CONSTRAINT "FK_4e76593c04f48f504100a8433d9" FOREIGN KEY ("songSongId") REFERENCES "songs"("song_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlist_song" ADD CONSTRAINT "FK_639488664fbc74f43f88242009c" FOREIGN KEY ("playlistPlaylistId") REFERENCES "playlists"("playlist_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlist_song" ADD CONSTRAINT "FK_ae5cfaa37e44e511e3d77eb7c44" FOREIGN KEY ("songSongId") REFERENCES "songs"("song_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlists" ADD CONSTRAINT "FK_ea5063483085661926687b8f38e" FOREIGN KEY ("ownerUserId") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlists" DROP CONSTRAINT "FK_ea5063483085661926687b8f38e"`);
        await queryRunner.query(`ALTER TABLE "playlist_song" DROP CONSTRAINT "FK_ae5cfaa37e44e511e3d77eb7c44"`);
        await queryRunner.query(`ALTER TABLE "playlist_song" DROP CONSTRAINT "FK_639488664fbc74f43f88242009c"`);
        await queryRunner.query(`ALTER TABLE "liked_song" DROP CONSTRAINT "FK_4e76593c04f48f504100a8433d9"`);
        await queryRunner.query(`ALTER TABLE "liked_song" DROP CONSTRAINT "FK_159132dbc3aa58a49328046f7c1"`);
        await queryRunner.query(`DROP TABLE "playlists"`);
        await queryRunner.query(`DROP TABLE "playlist_song"`);
        await queryRunner.query(`DROP TABLE "liked_song"`);
    }

}
