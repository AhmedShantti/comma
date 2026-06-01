import { Controller, Get, Post, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { ReceiptService } from '../services/receipt.service';

@ApiTags('receipts')
@ApiBearerAuth()
@Controller('receipts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Get()
  findAll(@Query() filters: any) {
    return this.receiptService.findAll(filters);
  }

  @Get('stats')
  getStats() {
    return this.receiptService.getReceiptStats();
  }

  @Get('top-tables')
  getTopTables() {
    return this.receiptService.getMostActiveTables();
  }

  @Get('top-items')
  getTopItems() {
    return this.receiptService.getTopSellingItems();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receiptService.findById(id);
  }

  @Post(':id/reprint')
  reprint(@Param('id') id: string) {
    return this.receiptService.findById(id);
  }
}
