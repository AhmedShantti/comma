import { IsOptional, IsString, IsBoolean, IsDecimal } from 'class-validator';

export class UpdateRestaurantSettingsDto {
  @IsOptional()
  @IsString()
  opening_time?: string;

  @IsOptional()
  @IsString()
  closing_time?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  default_service_charge_percent?: number;

  @IsOptional()
  default_discount_percent?: number;

  @IsOptional()
  @IsString()
  service_charge_type?: 'fixed' | 'percentage';

  @IsOptional()
  @IsBoolean()
  service_tax_included?: boolean;

  @IsOptional()
  @IsBoolean()
  accept_online_orders?: boolean;

  @IsOptional()
  @IsBoolean()
  accept_delivery?: boolean;

  @IsOptional()
  @IsBoolean()
  accepts_reservations?: boolean;
}
