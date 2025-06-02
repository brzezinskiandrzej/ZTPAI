import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSongMoodFields1748863632052 implements MigrationInterface {
    name = 'AddSongMoodFields1748863632052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs" ADD "valence" double precision NOT NULL DEFAULT '0.5'`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "energy" double precision NOT NULL DEFAULT '0.5'`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "tempo" integer NOT NULL DEFAULT '120'`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "musical_key" character varying(4) NOT NULL DEFAULT 'C'`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "genres" character varying(120)`);
        await queryRunner.query(`UPDATE "songs" SET "genres" = 'unknown' WHERE "genres" IS NULL`);
        await queryRunner.query(`ALTER TABLE "songs" ALTER COLUMN "genres" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "genres"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "musical_key"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "tempo"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "energy"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "valence"`);
    }

}
