import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMenuSettingsTable1779700000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'menu_settings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid', isNullable: false },
          { name: 'hide_sold_out_items', type: 'boolean', default: false },
          { name: 'show_item_descriptions', type: 'boolean', default: true },
          { name: 'enable_addons', type: 'boolean', default: true },
          { name: 'enable_variants', type: 'boolean', default: true },
          { name: 'enable_allergen_warnings', type: 'boolean', default: false },
          { name: 'default_portion_size', type: 'varchar', default: "'medium'" },
          { name: 'show_item_images', type: 'boolean', default: true },
          { name: 'enable_menu_search', type: 'boolean', default: true },
          { name: 'items_per_page', type: 'integer', default: 12 },
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
    await queryRunner.dropTable('menu_settings');
  }
}
