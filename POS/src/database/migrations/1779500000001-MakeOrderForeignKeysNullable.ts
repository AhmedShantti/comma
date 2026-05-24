import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class MakeOrderForeignKeysNullable1779500000001 implements MigrationInterface {
    name = 'MakeOrderForeignKeysNullable1779500000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            'orders',
            'cashier_id',
            new TableColumn({
                name: 'cashier_id',
                type: 'uuid',
                isNullable: true,
            }),
        );

        await queryRunner.changeColumn(
            'orders',
            'shift_id',
            new TableColumn({
                name: 'shift_id',
                type: 'uuid',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            'orders',
            'cashier_id',
            new TableColumn({
                name: 'cashier_id',
                type: 'uuid',
                isNullable: false,
            }),
        );

        await queryRunner.changeColumn(
            'orders',
            'shift_id',
            new TableColumn({
                name: 'shift_id',
                type: 'uuid',
                isNullable: false,
            }),
        );
    }
}
