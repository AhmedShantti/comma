import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateIntegrationSettingsTable1779700000013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'integration_settings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid', isNullable: false },
          { name: 'enable_accounting_sync', type: 'boolean', default: false },
          { name: 'accounting_provider', type: 'varchar', isNullable: true },
          { name: 'enable_delivery_integration', type: 'boolean', default: false },
          { name: 'delivery_providers', type: 'jsonb', default: `'[]'` },
          { name: 'enable_loyalty_program', type: 'boolean', default: false },
          { name: 'loyalty_provider', type: 'varchar', isNullable: true },
          { name: 'enable_inventory_sync', type: 'boolean', default: false },
          { name: 'inventory_provider', type: 'varchar', isNullable: true },
          { name: 'enable_staff_scheduling_sync', type: 'boolean', default: false },
          { name: 'scheduling_provider', type: 'varchar', isNullable: true },
          { name: 'enable_webhook_notifications', type: 'boolean', default: false },
          { name: 'webhook_url', type: 'varchar', isNullable: true },
          { name: 'webhook_secret_key', type: 'text', isNullable: true },
          { name: 'webhook_events', type: 'jsonb', default: `'[]'` },
          { name: 'api_key', type: 'text', isNullable: true },
          { name: 'api_secret', type: 'text', isNullable: true },
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
    await queryRunner.dropTable('integration_settings');
  }
}
