import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsBanned1747826876017 implements MigrationInterface {
    name = 'AddIsBanned1747826876017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_banned" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_banned"`);
    }

}
