import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CashDrawerService } from './cash-drawer.service';
import { ShiftsService } from '../shifts/shifts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { IsNumber } from 'class-validator';

class CashTransactionDto {
  @IsNumber()
  amount: number;
  notes?: string;
}

@ApiTags('cash-drawer')
@ApiBearerAuth()
@Controller('cash-drawer')
@UseGuards(JwtAuthGuard)
export class CashDrawerController {
  constructor(
    private readonly cashDrawerService: CashDrawerService,
    private readonly shiftsService: ShiftsService,
  ) {}

  @Get()
  async getCashDrawer(@CurrentUser() user: User) {
    const shift = await this.shiftsService.getCurrentShift(user.id);
    return this.cashDrawerService.getCashDrawerByShift(shift.id);
  }

  @Post('cash-in')
  async recordCashIn(@CurrentUser() user: User, @Body() dto: CashTransactionDto) {
    const shift = await this.shiftsService.getCurrentShift(user.id);
    return this.cashDrawerService.recordCashIn(shift.id, dto.amount, dto.notes);
  }

  @Post('cash-out')
  async recordCashOut(@CurrentUser() user: User, @Body() dto: CashTransactionDto) {
    const shift = await this.shiftsService.getCurrentShift(user.id);
    return this.cashDrawerService.recordCashOut(shift.id, dto.amount, dto.notes);
  }
}
