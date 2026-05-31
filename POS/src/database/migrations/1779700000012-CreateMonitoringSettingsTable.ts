import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateMonitoringSettingsTable1779700000012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'monitoring_settings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid', isNullable: false },
          { name: 'error_tracking_enabled', type: 'boolean', default: false },
          { name: 'error_tracking_provider', type: 'varchar', isNullable: true },
          { name: 'uptime_monitoring_enabled', type: 'boolean', default: false },
          { name: 'uptime_check_interval_minutes', type: 'integer', default: 5 },
          { name: 'database_performance_monitoring', type: 'boolean', default: false },
          { name: 'api_response_time_threshold_ms', type: 'integer', default: 1000 },
          { name: 'alert_low_disk_space_threshold_percent', type: 'integer', default: 10 },
          { name: 'alert_high_cpu_threshold_percent', type: 'integer', default: 80 },
          { name: 'alert_email_recipients', type: 'jsonb', default: `'[]'` },
          { name: 'performance_log_retention_days', type: 'integer', default: 30 },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['restaurant_id'],
            referencedTableName: 'restaurants',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
        indices: [
          { columnNames: ['restaurant_id'], isUnique: true },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('monitoring_settings');
  }
}
