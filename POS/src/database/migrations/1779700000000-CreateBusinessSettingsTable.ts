import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBusinessSettingsTable1779700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'business_settings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid', isNullable: false },
          { name: 'restaurant_name', type: 'varchar', isNullable: true },
          { name: 'restaurant_phone', type: 'varchar', isNullable: true },
          { name: 'restaurant_email', type: 'varchar', isNullable: true },
          { name: 'business_address', type: 'varchar', isNullable: true },
          { name: 'business_city', type: 'varchar', isNullable: true },
          { name: 'business_postal_code', type: 'varchar', isNullable: true },
          { name: 'business_license_number', type: 'varchar', isNullable: true },
          { name: 'tax_id', type: 'varchar', isNullable: true },
          { name: 'currency_code', type: 'varchar', default: "'EGP'" },
          { name: 'owner_name', type: 'varchar', isNullable: true },
          { name: 'owner_email', type: 'varchar', isNullable: true },
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
    await queryRunner.dropTable('business_settings');
  }
}
