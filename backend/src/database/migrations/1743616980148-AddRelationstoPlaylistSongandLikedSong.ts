import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationstoPlaylistSongandLikedSong1743616980148 implements MigrationInterface {
    name = 'AddRelationstoPlaylistSongandLikedSong1743616980148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "liked_song" DROP CONSTRAINT "FK_159132dbc3aa58a49328046f7c1"`);
        await queryRunner.query(`ALTER TABLE "liked_song" DROP CONSTRAINT "FK_4e76593c04f48f504100a8433d9"`);
        await queryRunner.query(`ALTER TABLE "playlist_song" DROP CONSTRAINT "FK_639488664fbc74f43f88242009c"`);
        await queryRunner.query(`ALTER TABLE "playlist_song" DROP CONSTRAINT "FK_ae5cfaa37e44e511e3d77eb7c44"`);
        await queryRunner.query(`ALTER TABLE "liked_song" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "liked_song" DROP COLUMN "songSongId"`);
        await queryRunner.query(`ALTER TABLE "playlist_song" DROP COLUMN "playlistPlaylistId"`);
        await queryRunner.query(`ALTER TABLE "playlist_song" DROP COLUMN "songSongId"`);
        await queryRunner.query(`ALTER TABLE "liked_song" ADD CONSTRAINT "FK_6014cf3799b4bc29d3fb5cb0b31" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "liked_song" ADD CONSTRAINT "FK_1cc5d3d93f0cc7f12ba0046df05" FOREIGN KEY ("song_id") REFERENCES "songs"("song_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlist_song" ADD CONSTRAINT "FK_404e93f5821bb1475c17b08882a" FOREIGN KEY ("playlist_id") REFERENCES "playlists"("playlist_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlist_song" ADD CONSTRAINT "FK_bf47d280a95a3528ff259743005" FOREIGN KEY ("song_id") REFERENCES "songs"("song_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlist_song" DROP CONSTRAINT "FK_bf47d280a95a3528ff259743005"`);
        await queryRunner.query(`ALTER TABLE "playlist_song" DROP CONSTRAINT "FK_404e93f5821bb1475c17b08882a"`);
        await queryRunner.query(`ALTER TABLE "liked_song" DROP CONSTRAINT "FK_1cc5d3d93f0cc7f12ba0046df05"`);
        await queryRunner.query(`ALTER TABLE "liked_song" DROP CONSTRAINT "FK_6014cf3799b4bc29d3fb5cb0b31"`);
        await queryRunner.query(`ALTER TABLE "playlist_song" ADD "songSongId" integer`);
        await queryRunner.query(`ALTER TABLE "playlist_song" ADD "playlistPlaylistId" integer`);
        await queryRunner.query(`ALTER TABLE "liked_song" ADD "songSongId" integer`);
        await queryRunner.query(`ALTER TABLE "liked_song" ADD "userUserId" integer`);
        await queryRunner.query(`ALTER TABLE "playlist_song" ADD CONSTRAINT "FK_ae5cfaa37e44e511e3d77eb7c44" FOREIGN KEY ("songSongId") REFERENCES "songs"("song_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlist_song" ADD CONSTRAINT "FK_639488664fbc74f43f88242009c" FOREIGN KEY ("playlistPlaylistId") REFERENCES "playlists"("playlist_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "liked_song" ADD CONSTRAINT "FK_4e76593c04f48f504100a8433d9" FOREIGN KEY ("songSongId") REFERENCES "songs"("song_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "liked_song" ADD CONSTRAINT "FK_159132dbc3aa58a49328046f7c1" FOREIGN KEY ("userUserId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
