import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashDrawer } from './entities/cash-drawer.entity';
import { CashDrawerService } from './cash-drawer.service';
import { CashDrawerController } from './cash-drawer.controller';
import { ShiftsModule } from '../shifts/shifts.module';

@Module({
  imports: [TypeOrmModule.forFeature([CashDrawer]), ShiftsModule],
  controllers: [CashDrawerController],
  providers: [CashDrawerService],
  exports: [CashDrawerService],
})
export class CashDrawerModule {}
