import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddActiveOrderIdToTables1780100000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'tables',
      new TableColumn({
        name: 'active_order_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tables', 'active_order_id');
  }
}
