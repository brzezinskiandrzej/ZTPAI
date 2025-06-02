import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomFieldsToLogs1748893907964 implements MigrationInterface {
    name = 'AddCustomFieldsToLogs1748893907964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_logs" DROP CONSTRAINT "FK_ab8ccc3aab203e7cd9c656ec807"`);
        await queryRunner.query(`ALTER TABLE "admin_logs" DROP COLUMN "actorUserId"`);
        await queryRunner.query(`ALTER TABLE "admin_logs" ADD "meta" jsonb`);
        await queryRunner.query(`ALTER TABLE "admin_logs" ADD "actor_id" integer`);
        await queryRunner.query(`ALTER TABLE "admin_logs" DROP COLUMN "action"`);
        await queryRunner.query(`ALTER TABLE "admin_logs" ADD "action" character varying(32)`);
        await queryRunner.query(`ALTER TABLE "admin_logs" ADD CONSTRAINT "FK_3df363f383075d397bfde7443b2" FOREIGN KEY ("actor_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`UPDATE "admin_logs" SET "action" = 'LEGACY' WHERE "action" IS NULL`);
        await queryRunner.query(`ALTER TABLE "admin_logs" ALTER COLUMN "action" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_logs" DROP CONSTRAINT "FK_3df363f383075d397bfde7443b2"`);
        await queryRunner.query(`ALTER TABLE "admin_logs" DROP COLUMN "action"`);
        await queryRunner.query(`ALTER TABLE "admin_logs" ADD "action" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admin_logs" DROP COLUMN "actor_id"`);
        await queryRunner.query(`ALTER TABLE "admin_logs" DROP COLUMN "meta"`);
        await queryRunner.query(`ALTER TABLE "admin_logs" ADD "actorUserId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admin_logs" ADD CONSTRAINT "FK_ab8ccc3aab203e7cd9c656ec807" FOREIGN KEY ("actorUserId") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
