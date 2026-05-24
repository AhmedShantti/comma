import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateMenuItemAddonsTable1779600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'menu_item_addons',
        columns: [
          {
            name: 'menu_item_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'addon_id',
            type: 'uuid',
            isPrimary: true,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['menu_item_id'],
            referencedTableName: 'menu_items',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['addon_id'],
            referencedTableName: 'addons',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('menu_item_addons');
  }
}
