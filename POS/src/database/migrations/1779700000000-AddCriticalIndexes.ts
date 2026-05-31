import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddCriticalIndexes1779700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Index on orders.created_at for date range queries (reports, shift cutoff)
    await queryRunner.createIndex(
      'orders',
      new TableIndex({
        name: 'IDX_orders_created_at',
        columnNames: ['created_at'],
        isUnique: false,
      }),
    );

    // Index on orders.status for status filtering
    await queryRunner.createIndex(
      'orders',
      new TableIndex({
        name: 'IDX_orders_status',
        columnNames: ['status'],
        isUnique: false,
      }),
    );

    // Composite index on orders for typical dashboard queries
    await queryRunner.createIndex(
      'orders',
      new TableIndex({
        name: 'IDX_orders_status_created_at',
        columnNames: ['status', 'created_at'],
        isUnique: false,
      }),
    );

    // Index on order_items.order_id for joining items to orders
    await queryRunner.createIndex(
      'order_items',
      new TableIndex({
        name: 'IDX_order_items_order_id',
        columnNames: ['order_id'],
        isUnique: false,
      }),
    );

    // Index on menu_items.category_id for filtering by category
    await queryRunner.createIndex(
      'menu_items',
      new TableIndex({
        name: 'IDX_menu_items_category_id',
        columnNames: ['category_id'],
        isUnique: false,
      }),
    );

    // Index on shifts for user-based queries
    await queryRunner.createIndex(
      'shifts',
      new TableIndex({
        name: 'IDX_shifts_user_id_status',
        columnNames: ['user_id', 'status'],
        isUnique: false,
      }),
    );

    // Index on tables for number lookups
    await queryRunner.createIndex(
      'tables',
      new TableIndex({
        name: 'IDX_tables_table_number',
        columnNames: ['table_number'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('orders', 'IDX_orders_created_at');
    await queryRunner.dropIndex('orders', 'IDX_orders_status');
    await queryRunner.dropIndex('orders', 'IDX_orders_status_created_at');
    await queryRunner.dropIndex('order_items', 'IDX_order_items_order_id');
    await queryRunner.dropIndex('menu_items', 'IDX_menu_items_category_id');
    await queryRunner.dropIndex('shifts', 'IDX_shifts_user_id_status');
    await queryRunner.dropIndex('tables', 'IDX_tables_table_number');
  }
}
