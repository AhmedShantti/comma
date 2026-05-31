import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateShiftSettingsTable1779700000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shift_settings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid', isNullable: false },
          { name: 'shift_duration_minutes', type: 'integer', default: 480 },
          { name: 'allow_shift_overlap', type: 'boolean', default: false },
          { name: 'auto_clock_out_enabled', type: 'boolean', default: false },
          { name: 'auto_clock_out_minutes', type: 'integer', default: 600 },
          { name: 'break_duration_minutes', type: 'integer', default: 30 },
          { name: 'breaks_per_shift', type: 'integer', default: 2 },
          { name: 'allow_manual_clock_in_out', type: 'boolean', default: true },
          { name: 'warn_long_shifts', type: 'boolean', default: false },
          { name: 'warn_long_shift_hours', type: 'integer', default: 10 },
          { name: 'payroll_integration_enabled', type: 'boolean', default: false },
          { name: 'payroll_provider', type: 'varchar', isNullable: true },
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
    await queryRunner.dropTable('shift_settings');
  }
}
