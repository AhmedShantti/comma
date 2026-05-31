import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateRestaurantSettingsTable1779700000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'restaurant_settings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid', isNullable: false },
          { name: 'opening_time', type: 'time', isNullable: true },
          { name: 'closing_time', type: 'time', isNullable: true },
          { name: 'timezone', type: 'varchar', default: "'UTC'" },
          { name: 'default_service_charge_percent', type: 'numeric', precision: 5, scale: 2, default: 0 },
          { name: 'default_discount_percent', type: 'numeric', precision: 5, scale: 2, default: 0 },
          { name: 'service_charge_type', type: 'varchar', default: "'percentage'" },
          { name: 'service_tax_included', type: 'boolean', default: false },
          { name: 'accept_online_orders', type: 'boolean', default: false },
          { name: 'accept_delivery', type: 'boolean', default: false },
          { name: 'accepts_reservations', type: 'boolean', default: false },
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
    await queryRunner.dropTable('restaurant_settings');
  }
}
