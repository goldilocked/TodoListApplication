import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewField1756904803124 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "toDoItems" ADD COLUMN "dueDate" DATE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "toDoItems" DROP COLUMN "dueDate"`, undefined);
  }

}
