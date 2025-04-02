import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSongs1743590495812 implements MigrationInterface {
    name = 'AddSongs1743590495812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "songs" ("song_id" SERIAL NOT NULL, "title" character varying NOT NULL, "artwork_url" character varying, "play_count" integer NOT NULL DEFAULT '0', "artist_id" integer, "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2d6edad8a9d0148b88f54668ca2" PRIMARY KEY ("song_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "songs"`);
    }

}
