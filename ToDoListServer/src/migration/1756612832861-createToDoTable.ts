import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateToDoTable1756612832861 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "toDoItems" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" character varying NOT NULL,
        "description" character varying NOT NULL,
        "status" character varying NOT NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "toDoItems"`, undefined);
  }
}