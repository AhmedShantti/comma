import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOrderStatusSettingsTable1779700000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order_status_settings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'restaurant_id', type: 'uuid', isNullable: false },
          { name: 'statuses', type: 'jsonb', default: `'[{"id":"open","name":"Open","displayColor":"#FFB800","order":1,"isTerminal":false,"isPredefined":true},{"id":"confirmed","name":"Confirmed","displayColor":"#4CAF50","order":2,"isTerminal":false,"isPredefined":true},{"id":"preparing","name":"Preparing","displayColor":"#2196F3","order":3,"isTerminal":false,"isPredefined":true},{"id":"ready","name":"Ready","displayColor":"#9C27B0","order":4,"isTerminal":false,"isPredefined":true},{"id":"served","name":"Served","displayColor":"#4CAF50","order":5,"isTerminal":false,"isPredefined":true},{"id":"paid","name":"Paid","displayColor":"#00BCD4","order":6,"isTerminal":true,"isPredefined":true},{"id":"cancelled","name":"Cancelled","displayColor":"#F44336","order":7,"isTerminal":true,"isPredefined":true}]'` },
          { name: 'transition_rules', type: 'jsonb', isNullable: true },
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
    await queryRunner.dropTable('order_status_settings');
  }
}
