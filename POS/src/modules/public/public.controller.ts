import { Controller, Get, Post, Body, Param, Ip, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PublicService } from './public.service';
import { CreateCustomerOrderDto } from './dto/create-customer-order.dto';

@Controller('public')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('tables/:id')
  async getTable(@Param('id') tableId: string) {
    const table = await this.publicService.getTable(tableId);
    return table;
  }

  @Post('orders')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 600000 } }) // 5 requests per 10 minutes per IP
  async createCustomerOrder(
    @Body() dto: CreateCustomerOrderDto,
    @Ip() ipAddress: string,
  ) {
    console.log('[PublicController] Received POST /public/orders');
    console.log('[PublicController] Request body:', JSON.stringify(dto, null, 2));
    console.log('[PublicController] Items count:', dto.items?.length ?? 0);

    const order = await this.publicService.createCustomerOrder(dto);

    console.log('[PublicController] Order created:', {
      orderId: order.id,
      orderNumber: order.order_number,
      itemCount: order.items?.length ?? 0,
    });

    return {
      success: true,
      orderNumber: order.order_number,
      message: 'Order placed successfully',
      orderId: order.id,
    };
  }
}
