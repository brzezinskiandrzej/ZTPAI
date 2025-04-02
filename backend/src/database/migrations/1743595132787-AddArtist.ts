import { MigrationInterface, QueryRunner } from "typeorm";

export class AddArtist1743595132787 implements MigrationInterface {
    name = 'AddArtist1743595132787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "artists" ("artist_id" SERIAL NOT NULL, "name" character varying NOT NULL, "bio" character varying, CONSTRAINT "PK_51fb94826a5db1782cefcad31a1" PRIMARY KEY ("artist_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "artists"`);
    }

}
