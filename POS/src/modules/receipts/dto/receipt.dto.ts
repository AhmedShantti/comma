import { IsString, IsOptional, IsNumber, IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../../../common/enums/payment.enum';

export class ReceiptFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receipt_number?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  table_number?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cashier_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  payment_method?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  start_date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  end_date?: string;
}

export class CheckoutPaymentDto {
  @ApiProperty({ enum: PaymentMethod })
  method: PaymentMethod;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reference_number?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  card_last_four?: string;
}

export class CheckoutTableDto {
  @ApiProperty({ type: [CheckoutPaymentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutPaymentDto)
  payments: CheckoutPaymentDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  waiter_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discount_value?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  discount_type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateReceiptSettingsDto {
  @IsOptional() @IsString() receipt_prefix?: string;
  @IsOptional() @IsString() receipt_number_format?: string;
  @IsOptional() @IsString() business_name_on_receipt?: string;
  @IsOptional() @IsString() business_address_on_receipt?: string;
  @IsOptional() @IsString() business_phone_on_receipt?: string;
  @IsOptional() @IsString() tax_number_on_receipt?: string;
  @IsOptional() @IsString() logo_url?: string;
  @IsOptional() @IsString() header_text?: string;
  @IsOptional() @IsString() footer_message?: string;
  @IsOptional() @IsBoolean() show_tax_breakdown?: boolean;
  @IsOptional() @IsBoolean() show_service_charge?: boolean;
  @IsOptional() @IsBoolean() show_waiter_name?: boolean;
  @IsOptional() @IsBoolean() show_cashier_name?: boolean;
  @IsOptional() @IsBoolean() show_order_number?: boolean;
  @IsOptional() @IsBoolean() show_table_number?: boolean;
  @IsOptional() @IsBoolean() auto_print_after_payment?: boolean;
  @IsOptional() @IsString() default_paper_size?: string;
  @IsOptional() @IsString() currency_symbol?: string;
  @IsOptional() @Type(() => Number) @IsNumber() tax_percentage?: number;
  @IsOptional() @Type(() => Number) @IsNumber() service_charge_percentage?: number;
}
