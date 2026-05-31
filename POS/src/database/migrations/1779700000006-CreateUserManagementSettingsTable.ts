import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserManagementSettingsTable1779700000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_management_settings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid', isNullable: false },
          { name: 'password_min_length', type: 'integer', default: 8 },
          { name: 'password_require_uppercase', type: 'boolean', default: true },
          { name: 'password_require_numbers', type: 'boolean', default: true },
          { name: 'password_require_special_chars', type: 'boolean', default: false },
          { name: 'session_timeout_minutes', type: 'integer', default: 30 },
          { name: 'require_2fa', type: 'boolean', default: false },
          { name: 'enable_email_login', type: 'boolean', default: true },
          { name: 'email_domain_restrictions', type: 'jsonb', default: `'[]'` },
          { name: 'auto_disable_inactive_users_days', type: 'integer', default: 90 },
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
    await queryRunner.dropTable('user_management_settings');
  }
}
