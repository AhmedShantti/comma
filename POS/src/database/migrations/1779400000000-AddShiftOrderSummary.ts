import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddShiftOrderSummary1779400000000 implements MigrationInterface {
    name = 'AddShiftOrderSummary1779400000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'shifts',
            new TableColumn({
                name: 'total_orders',
                type: 'integer',
                default: 0,
                isNullable: false,
            }),
        );

        await queryRunner.addColumn(
            'shifts',
            new TableColumn({
                name: 'total_amount',
                type: 'numeric',
                precision: 12,
                scale: 2,
                default: 0,
                isNullable: false,
            }),
        );

        await queryRunner.addColumn(
            'shifts',
            new TableColumn({
                name: 'total_items',
                type: 'integer',
                default: 0,
                isNullable: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('shifts', 'total_items');
        await queryRunner.dropColumn('shifts', 'total_amount');
        await queryRunner.dropColumn('shifts', 'total_orders');
    }
}
