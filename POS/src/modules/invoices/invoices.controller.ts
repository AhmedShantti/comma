import { Controller, Post, Get, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { ProcessPaymentDto, RefundDto } from './dto/invoice.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { User } from '../users/entities/user.entity';

@ApiTags('invoices')
@ApiBearerAuth()
@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto, @Query() filters?: any) {
    return this.invoicesService.findAll(pagination, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findById(id);
  }

  @Get(':id/receipt')
  getReceipt(@Param('id') id: string) {
    return this.invoicesService.getReceiptData(id);
  }

  @Post(':id/refund')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  refund(
    @Param('id') id: string,
    @Body() refundDto: RefundDto,
    @CurrentUser() user: User,
  ) {
    return this.invoicesService.processRefund(id, user.id, refundDto);
  }
}
