import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewOrderStatuses1780100000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new enum values to the orders status column
    // PostgreSQL requires ALTER TYPE to add new enum values
    await queryRunner.query(`ALTER TYPE orders_status_enum ADD VALUE IF NOT EXISTS 'in_progress'`);
    await queryRunner.query(`ALTER TYPE orders_status_enum ADD VALUE IF NOT EXISTS 'paid'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL doesn't support removing enum values easily
    // This is a no-op for the down migration
  }
}
