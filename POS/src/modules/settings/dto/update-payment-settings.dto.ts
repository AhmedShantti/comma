import { IsOptional, IsArray, IsBoolean } from 'class-validator';

export class UpdatePaymentSettingsDto {
  @IsOptional()
  @IsArray()
  accepted_payment_methods?: string[];

  @IsOptional()
  @IsArray()
  card_processors?: any[];

  @IsOptional()
  @IsBoolean()
  tip_enabled?: boolean;

  @IsOptional()
  @IsArray()
  tip_percentages?: number[];

  @IsOptional()
  tip_suggestion_mode?: 'disabled' | 'percentage' | 'fixed';

  @IsOptional()
  @IsArray()
  fixed_tip_amounts?: number[];

  @IsOptional()
  @IsBoolean()
  split_bill_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  require_payment_confirmation?: boolean;

  @IsOptional()
  tax_rate_percent?: number;

  @IsOptional()
  @IsBoolean()
  service_charge_included_in_price?: boolean;
}
