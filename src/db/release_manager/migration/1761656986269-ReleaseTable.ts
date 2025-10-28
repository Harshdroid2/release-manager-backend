import { MigrationInterface, QueryRunner } from "typeorm";

export class ReleaseTable1761656986269 implements MigrationInterface {
    name = 'ReleaseTable1761656986269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tran"."Release" ("Id" BIGSERIAL NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "Version" character varying NOT NULL, "Repo" character varying NOT NULL, "IsApproved" boolean NOT NULL DEFAULT false, "IsRunning" boolean NOT NULL DEFAULT false, "IsCompleted" boolean NOT NULL DEFAULT false, "MergedByUserId" numeric, CONSTRAINT "UQ_e15ab3a10a8670c2f6b3a2c8710" UNIQUE ("Version"), CONSTRAINT "PK_3f3857ee42908ee8cc0b8145061" PRIMARY KEY ("Id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tran"."Release"`);
    }

}
