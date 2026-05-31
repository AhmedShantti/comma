import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNotificationSettingsTable1779700000008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notification_settings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid', isNullable: false },
          { name: 'email_notifications_enabled', type: 'boolean', default: true },
          { name: 'sms_notifications_enabled', type: 'boolean', default: false },
          { name: 'push_notifications_enabled', type: 'boolean', default: true },
          { name: 'in_app_notifications_enabled', type: 'boolean', default: true },
          { name: 'notify_on_new_orders', type: 'boolean', default: true },
          { name: 'notify_on_payment_received', type: 'boolean', default: true },
          { name: 'notify_on_staff_late', type: 'boolean', default: false },
          { name: 'notify_on_low_inventory', type: 'boolean', default: false },
          { name: 'notification_email_address', type: 'varchar', isNullable: true },
          { name: 'notification_phone_number', type: 'varchar', isNullable: true },
          { name: 'quiet_hours_enabled', type: 'boolean', default: false },
          { name: 'quiet_hours_start', type: 'time', isNullable: true },
          { name: 'quiet_hours_end', type: 'time', isNullable: true },
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
    await queryRunner.dropTable('notification_settings');
  }
}
