import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminLogs1747903456800 implements MigrationInterface {
    name = 'AddAdminLogs1747903456800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin_logs" ("id" SERIAL NOT NULL, "action" character varying NOT NULL, "targetId" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "actorUserId" integer NOT NULL, CONSTRAINT "PK_1bd116497b175ab12373dcb362b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "admin_logs" ADD CONSTRAINT "FK_ab8ccc3aab203e7cd9c656ec807" FOREIGN KEY ("actorUserId") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_logs" DROP CONSTRAINT "FK_ab8ccc3aab203e7cd9c656ec807"`);
        await queryRunner.query(`DROP TABLE "admin_logs"`);
    }

}
