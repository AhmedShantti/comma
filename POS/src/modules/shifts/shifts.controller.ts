import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto, CloseShiftDto } from './dto/create-shift.dto';
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

  @Get()
  getShifts(
    @Query() pagination: PaginationDto,
    @Query() filters?: { userId?: string; status?: string },
  ) {
    return this.shiftsService.getShifts(pagination, {
      userId: filters?.userId,
      status: filters?.status as any,
    });
  }

  @Get(':id')
  getShift(@Param('id') id: string) {
    return this.shiftsService.getShiftById(id);
  }
}
