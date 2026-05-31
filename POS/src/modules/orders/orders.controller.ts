import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto, ChangeOrderStatusDto, AddOrderItemsDto, UpdateOrderItemDto, VoidOrderItemDto, CancelOrderDto } from './dto/create-order.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { User } from '../users/entities/user.entity';
import { InvoicesService } from '../invoices/invoices.service';
import { ProcessPaymentDto } from '../invoices/dto/invoice.dto';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly invoicesService: InvoicesService,
  ) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(user, createOrderDto);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto, @Query() filters?: any) {
    return this.ordersService.findAll(pagination, filters);
  }

  @Get('active')
  getActiveOrders() {
    return this.ordersService.getActiveOrders();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  changeStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeOrderStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.changeStatus(id, changeStatusDto, user.id);
  }

  @Delete(':id')
  cancel(
    @Param('id') id: string,
    @Body() cancelOrderDto: CancelOrderDto,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.cancel(id, cancelOrderDto.reason, user.id);
  }

  @Post(':id/items')
  addItems(
    @Param('id') id: string,
    @Body() addItemsDto: AddOrderItemsDto,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.addItems(id, addItemsDto.items, user.id);
  }

  @Patch(':id/items/:itemId')
  updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdateOrderItemDto,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.updateItem(id, itemId, updateItemDto, user.id);
  }

  @Delete(':id/items/:itemId')
  removeItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    return this.ordersService.removeItem(id, itemId);
  }

  @Post(':id/items/:itemId/void')
  voidItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() voidDto: VoidOrderItemDto,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.voidItem(id, itemId, voidDto, user.id);
  }

  @Get(':id/history')
  getHistory(@Param('id') id: string) {
    return this.ordersService.getOrderHistory(id);
  }

  @Post(':id/duplicate')
  duplicate(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.duplicateOrder(id, user.id);
  }

  @Post(':id/pay')
  processPayment(
    @Param('id') id: string,
    @Body() processPaymentDto: ProcessPaymentDto,
    @CurrentUser() user: User,
  ) {
    return this.invoicesService.processPayment(id, user.id, processPaymentDto);
  }
}
