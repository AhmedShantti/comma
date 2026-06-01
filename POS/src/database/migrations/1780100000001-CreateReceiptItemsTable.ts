import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateReceiptItemsTable1780100000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'receipt_items',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'receipt_id', type: 'uuid', isNullable: false },
          { name: 'item_name_en', type: 'varchar', isNullable: false },
          { name: 'item_name_ar', type: 'varchar', isNullable: false },
          { name: 'quantity', type: 'int', default: 1 },
          { name: 'unit_price', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'addons_total', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'line_total', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'notes', type: 'varchar', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['receipt_id'],
            referencedTableName: 'receipts',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('receipt_items');
  }
}
