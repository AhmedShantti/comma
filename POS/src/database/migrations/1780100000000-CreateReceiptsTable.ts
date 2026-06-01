import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateReceiptsTable1780100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'receipts',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'receipt_number', type: 'varchar', isUnique: true, isNullable: false },
          { name: 'order_id', type: 'uuid', isNullable: false },
          { name: 'table_number', type: 'int', isNullable: true },
          { name: 'table_id', type: 'uuid', isNullable: true },
          { name: 'order_number', type: 'varchar', isNullable: false },
          { name: 'cashier_id', type: 'uuid', isNullable: true },
          { name: 'cashier_name', type: 'varchar', isNullable: true },
          { name: 'waiter_id', type: 'uuid', isNullable: true },
          { name: 'waiter_name', type: 'varchar', isNullable: true },
          { name: 'subtotal', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'discount_type', type: 'varchar', isNullable: true },
          { name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 0 },
          { name: 'tax_amount', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'service_charge_rate', type: 'decimal', precision: 5, scale: 2, default: 0 },
          { name: 'service_charge_amount', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'total', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'payment_method', type: 'varchar', isNullable: true },
          { name: 'payment_status', type: 'varchar', default: "'paid'" },
          { name: 'business_name', type: 'varchar', isNullable: true },
          { name: 'business_address', type: 'varchar', isNullable: true },
          { name: 'business_phone', type: 'varchar', isNullable: true },
          { name: 'tax_id', type: 'varchar', isNullable: true },
          { name: 'footer_message', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
        indices: [
          { columnNames: ['receipt_number'], isUnique: true },
          { columnNames: ['order_id'] },
          { columnNames: ['table_id'] },
          { columnNames: ['cashier_id'] },
          { columnNames: ['created_at'] },
          { columnNames: ['payment_method'] },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('receipts');
  }
}
