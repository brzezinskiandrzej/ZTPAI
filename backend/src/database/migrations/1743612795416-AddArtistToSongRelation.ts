import { MigrationInterface, QueryRunner } from "typeorm";

export class AddArtistToSongRelation1743612795416 implements MigrationInterface {
    name = 'AddArtistToSongRelation1743612795416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs" ADD CONSTRAINT "FK_999ba7dd3c94dd5f9649944a5c6" FOREIGN KEY ("artist_id") REFERENCES "artists"("artist_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs" DROP CONSTRAINT "FK_999ba7dd3c94dd5f9649944a5c6"`);
    }

}
