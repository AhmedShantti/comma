import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateSecuritySettingsTable1779700000011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'security_settings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid', isNullable: false },
          { name: 'ip_whitelist_enabled', type: 'boolean', default: false },
          { name: 'ip_whitelist', type: 'jsonb', default: `'[]'` },
          { name: 'ip_blacklist_enabled', type: 'boolean', default: false },
          { name: 'ip_blacklist', type: 'jsonb', default: `'[]'` },
          { name: 'enforce_https_only', type: 'boolean', default: true },
          { name: 'cors_enabled', type: 'boolean', default: false },
          { name: 'cors_origins', type: 'jsonb', default: `'[]'` },
          { name: 'csrf_protection_enabled', type: 'boolean', default: true },
          { name: 'audit_logging_enabled', type: 'boolean', default: true },
          { name: 'audit_log_retention_days', type: 'integer', default: 365 },
          { name: 'data_encryption_enabled', type: 'boolean', default: false },
          { name: 'require_password_reset_days', type: 'integer', default: 90 },
          { name: 'suspicious_activity_threshold', type: 'integer', default: 5 },
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
    await queryRunner.dropTable('security_settings');
  }
}
