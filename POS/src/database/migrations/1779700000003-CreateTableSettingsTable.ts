import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableSettingsTable1779700000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'table_settings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid', isNullable: false },
          { name: 'default_table_count', type: 'integer', default: 10 },
          { name: 'enable_qr_codes', type: 'boolean', default: true },
          { name: 'qr_code_format', type: 'varchar', default: "'url'" },
          { name: 'qr_prefix_url', type: 'varchar', isNullable: true },
          { name: 'enable_table_transfer', type: 'boolean', default: false },
          { name: 'table_merge_enabled', type: 'boolean', default: false },
          { name: 'auto_reserve_duration_minutes', type: 'integer', default: 120 },
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
    await queryRunner.dropTable('table_settings');
  }
}
