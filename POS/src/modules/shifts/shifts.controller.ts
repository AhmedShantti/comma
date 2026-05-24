import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto, CloseShiftDto, ShiftFiltersDto } from './dto/create-shift.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('shifts')
@ApiBearerAuth()
@Controller('shifts')
@UseGuards(JwtAuthGuard)
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post('open')
  openShift(
    @CurrentUser() user: User,
    @Body() createShiftDto: CreateShiftDto,
  ) {
    return this.shiftsService.openShift(user.id, createShiftDto);
  }

  @Post('close')
  closeShift(
    @CurrentUser() user: User,
    @Body() closeShiftDto: CloseShiftDto,
  ) {
    return this.shiftsService.closeShift(user.id, closeShiftDto);
  }

  @Get('current')
  getCurrentShift(@CurrentUser() user: User) {
    return this.shiftsService.getCurrentShift(user.id);
  }

  // ✅ Must be before :id route to avoid 'active' being treated as an id
  @Get('active')
  getActiveShifts() {
    return this.shiftsService.getActiveShifts();
  }

  // ✅ New: Get completed orders for a shift (must be before :id route)
  @Get(':id/orders')
  getShiftOrders(
    @Param('id') shiftId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.shiftsService.getShiftOrders(shiftId, pagination);
  }

  @Get()
  getShifts(
    @Query() pagination: PaginationDto,
    @Query() filters: ShiftFiltersDto, // ✅ Fixed: was causing filters to never work
  ) {
    return this.shiftsService.getShifts(pagination, {
      userId: filters?.userId,
      status: filters?.status as any,
      startDate: filters?.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters?.endDate ? new Date(filters.endDate) : undefined,
    });
  }

  @Get(':id')
  getShift(@Param('id') id: string) {
    return this.shiftsService.getShiftById(id);
  }
}
