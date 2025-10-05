import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1759494382212 implements MigrationInterface {
    name = 'InitialMigration1759494382212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "tran"."Users_role_enum" AS ENUM('admin', 'dev', 'qa', 'release_manager')`);
        await queryRunner.query(`CREATE TABLE "tran"."Users" ("Id" BIGSERIAL NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "Email" text NOT NULL, "GithubUsername" text, "GithubAccessToken" text, "Role" "tran"."Users_role_enum" NOT NULL DEFAULT 'dev', "IsActive" boolean NOT NULL DEFAULT true, "IsVerified" boolean NOT NULL DEFAULT false, "Password" text, "LastLogin" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_884fdf47515c24dbbf6d89c2d84" UNIQUE ("Email"), CONSTRAINT "PK_329bb2946729a51bd2b19a5159f" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TYPE "tran"."CompanyAdmin_role_enum" AS ENUM('admin', 'dev', 'qa', 'release_manager')`);
        await queryRunner.query(`CREATE TABLE "tran"."CompanyAdmin" ("Id" BIGSERIAL NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "Email" character varying NOT NULL, "Name" character varying, "Username" character varying NOT NULL, "Role" "tran"."CompanyAdmin_role_enum" NOT NULL, "IsActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_7830267a6de5753ae7638cd3cb5" UNIQUE ("Email"), CONSTRAINT "PK_84bb41d62efa6315e1133ecc71a" PRIMARY KEY ("Id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tran"."CompanyAdmin"`);
        await queryRunner.query(`DROP TYPE "tran"."CompanyAdmin_role_enum"`);
        await queryRunner.query(`DROP TABLE "tran"."Users"`);
        await queryRunner.query(`DROP TYPE "tran"."Users_role_enum"`);
    }

}
