import { IsNumber, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../../../common/enums/payment.enum';

export class CreatePaymentDto {
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

export class ProcessPaymentDto {
  @ApiProperty({ type: [CreatePaymentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePaymentDto)
  payments: CreatePaymentDto[];
}

export class RefundDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  reason: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  payment_id?: string;
}
