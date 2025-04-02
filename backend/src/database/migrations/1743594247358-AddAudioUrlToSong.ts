import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAudioUrlToSong1743594247358 implements MigrationInterface {
    name = 'AddAudioUrlToSong1743594247358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs" ADD "audio_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "audio_url"`);
    }

}
