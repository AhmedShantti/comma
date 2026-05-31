import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePaymentSettingsTable1779700000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payment_settings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid', isNullable: false },
          { name: 'accepted_payment_methods', type: 'jsonb', default: `'["cash","card"]'` },
          { name: 'card_processors', type: 'jsonb', default: `'[{"name":"stripe","enabled":false},{"name":"paypal","enabled":false},{"name":"square","enabled":false}]'` },
          { name: 'tip_enabled', type: 'boolean', default: true },
          { name: 'tip_percentages', type: 'jsonb', default: `'[10,15,20,25]'` },
          { name: 'tip_suggestion_mode', type: 'varchar', default: "'disabled'" },
          { name: 'fixed_tip_amounts', type: 'jsonb', default: `'[50,100,200]'` },
          { name: 'split_bill_enabled', type: 'boolean', default: false },
          { name: 'require_payment_confirmation', type: 'boolean', default: true },
          { name: 'tax_rate_percent', type: 'numeric', precision: 5, scale: 2, default: 0 },
          { name: 'service_charge_included_in_price', type: 'boolean', default: false },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
        indices: [
          { columnNames: ['restaurant_id'], isUnique: true },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('payment_settings');
  }
}
