import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAppearanceSettingsTable1779700000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'appearance_settings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid', isNullable: false },
          { name: 'primary_color', type: 'varchar', default: `'#c9a84c'` },
          { name: 'secondary_color', type: 'varchar', isNullable: true },
          { name: 'dark_mode_enabled', type: 'boolean', default: false },
          { name: 'font_family', type: 'varchar', default: `'Inter'` },
          { name: 'logo_url', type: 'varchar', isNullable: true },
          { name: 'favicon_url', type: 'varchar', isNullable: true },
          { name: 'invoice_header_text', type: 'text', isNullable: true },
          { name: 'invoice_footer_text', type: 'text', isNullable: true },
          { name: 'receipt_header_text', type: 'text', isNullable: true },
          { name: 'receipt_footer_text', type: 'text', isNullable: true },
          { name: 'theme_preset', type: 'varchar', default: `'modern'` },
          { name: 'custom_css', type: 'text', isNullable: true },
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
    await queryRunner.dropTable('appearance_settings');
  }
}
