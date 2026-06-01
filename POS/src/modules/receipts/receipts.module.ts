import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt, ReceiptItem } from './entities/receipt.entity';
import { ReceiptService } from './services/receipt.service';
import { ReceiptController } from './controllers/receipt.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt, ReceiptItem])],
  controllers: [ReceiptController],
  providers: [ReceiptService],
  exports: [ReceiptService],
})
export class ReceiptsModule {}
