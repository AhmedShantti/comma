import { Controller, Post, Body, Ip, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PublicService } from './public.service';
import { CreateCustomerOrderDto } from './dto/create-customer-order.dto';

@Controller('public')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @Post('orders')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 600000 } }) // 5 requests per 10 minutes per IP
  async createCustomerOrder(
    @Body() dto: CreateCustomerOrderDto,
    @Ip() ipAddress: string,
  ) {
    const order = await this.publicService.createCustomerOrder(dto);
    return {
      success: true,
      orderNumber: order.order_number,
      message: 'Order placed successfully',
      orderId: order.id,
    };
  }
}
