import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem, OrderItemAddOn, OrderStatusLog } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ShiftsModule } from '../shifts/shifts.module';
import { MenuItemsModule } from '../menu-items/menu-items.module';
import { AddonsModule } from '../addons/addons.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { TablesModule } from '../tables/tables.module';
import { ReceiptsModule } from '../receipts/receipts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, OrderItemAddOn, OrderStatusLog]),
    ShiftsModule,
    MenuItemsModule,
    AddonsModule,
    InvoicesModule,
    TablesModule,
    ReceiptsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
