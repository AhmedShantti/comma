import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateReportSettingsTable1779700000009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'report_settings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid', isNullable: false },
          { name: 'auto_daily_reports', type: 'boolean', default: false },
          { name: 'daily_report_time', type: 'time', default: `'23:00'` },
          { name: 'daily_report_recipients', type: 'jsonb', default: `'[]'` },
          { name: 'auto_weekly_reports', type: 'boolean', default: false },
          { name: 'weekly_report_day', type: 'integer', default: 0 },
          { name: 'weekly_report_time', type: 'time', isNullable: true },
          { name: 'weekly_report_recipients', type: 'jsonb', default: `'[]'` },
          { name: 'enable_profit_margins', type: 'boolean', default: true },
          { name: 'enable_sales_by_category', type: 'boolean', default: true },
          { name: 'enable_inventory_reports', type: 'boolean', default: false },
          { name: 'enable_staff_performance', type: 'boolean', default: false },
          { name: 'export_format_default', type: 'varchar', default: "'pdf'" },
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
    await queryRunner.dropTable('report_settings');
  }
}
