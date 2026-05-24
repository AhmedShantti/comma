import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddOrderSource1779500000000 implements MigrationInterface {
    name = 'AddOrderSource1779500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'orders',
            new TableColumn({
                name: 'source',
                type: 'varchar',
                default: "'pos'",
                isNullable: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('orders', 'source');
    }
}
