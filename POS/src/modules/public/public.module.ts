import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem, OrderItemAddOn } from '../orders/entities/order.entity';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { TablesModule } from '../tables/tables.module';
import { MenuItemsModule } from '../menu-items/menu-items.module';
import { AddonsModule } from '../addons/addons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, OrderItemAddOn]),
    TablesModule,
    MenuItemsModule,
    AddonsModule,
  ],
  controllers: [PublicController],
  providers: [PublicService],
  exports: [PublicService],
})
export class PublicModule {}
