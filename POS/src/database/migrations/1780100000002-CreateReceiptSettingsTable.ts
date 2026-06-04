import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateReceiptSettingsTable1780100000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'receipt_settings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid', isNullable: false },
          { name: 'receipt_prefix', type: 'varchar', default: "'RCT'" },
          { name: 'receipt_number_format', type: 'varchar', default: "'PREFIX-YYYYMMDD-XXXX'" },
          { name: 'business_name_on_receipt', type: 'varchar', isNullable: true },
          { name: 'business_address_on_receipt', type: 'varchar', isNullable: true },
          { name: 'business_phone_on_receipt', type: 'varchar', isNullable: true },
          { name: 'tax_number_on_receipt', type: 'varchar', isNullable: true },
          { name: 'logo_url', type: 'varchar', isNullable: true },
          { name: 'header_text', type: 'text', isNullable: true },
          { name: 'footer_message', type: 'text', isNullable: true },
          { name: 'show_tax_breakdown', type: 'boolean', default: true },
          { name: 'show_service_charge', type: 'boolean', default: true },
          { name: 'show_waiter_name', type: 'boolean', default: true },
          { name: 'show_cashier_name', type: 'boolean', default: true },
          { name: 'show_order_number', type: 'boolean', default: true },
          { name: 'show_table_number', type: 'boolean', default: true },
          { name: 'auto_print_after_payment', type: 'boolean', default: false },
          { name: 'default_paper_size', type: 'varchar', default: "'80mm'" },
          { name: 'currency_symbol', type: 'varchar', default: "'ILS'" },
          { name: 'tax_percentage', type: 'decimal', precision: 5, scale: 2, default: 15 },
          { name: 'service_charge_percentage', type: 'decimal', precision: 5, scale: 2, default: 0 },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
        indices: [
          { columnNames: ['restaurant_id'], isUnique: true },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('receipt_settings');
  }
}
