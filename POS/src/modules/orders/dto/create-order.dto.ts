import { IsString, IsOptional, IsNumber, IsUUID, IsEnum, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderType } from '../../../common/enums/order.enum';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsUUID()
  menu_item_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  variant_id?: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  addon_ids?: string[];
}

export class CreateOrderDto {
  @ApiProperty({ enum: OrderType })
  @IsEnum(OrderType)
  type: OrderType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  table_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  table_number?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customer_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customer_phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  delivery_address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  discount_value?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  discount_type?: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

export class UpdateOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customer_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customer_phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  discount_value?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  discount_type?: string;
}

export class ChangeOrderStatusDto {
  @ApiProperty({ enum: ['confirmed', 'preparing', 'ready', 'completed', 'cancelled', 'refunded'] })
  @IsString()
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CancelOrderDto {
  @ApiProperty()
  @IsString()
  reason: string;
}

export class AddOrderItemsDto {
  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

export class UpdateOrderItemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class VoidOrderItemDto {
  @ApiProperty()
  @IsString()
  reason: string;
}
