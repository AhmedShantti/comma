import { IsOptional, IsBoolean, IsString, IsArray } from 'class-validator';

export class UpdateIntegrationSettingsDto {
  @IsOptional()
  @IsBoolean()
  enable_accounting_sync?: boolean;

  @IsOptional()
  @IsString()
  accounting_provider?: string;

  @IsOptional()
  @IsBoolean()
  enable_delivery_integration?: boolean;

  @IsOptional()
  @IsArray()
  delivery_providers?: string[];

  @IsOptional()
  @IsBoolean()
  enable_loyalty_program?: boolean;

  @IsOptional()
  @IsString()
  loyalty_provider?: string;

  @IsOptional()
  @IsBoolean()
  enable_inventory_sync?: boolean;

  @IsOptional()
  @IsString()
  inventory_provider?: string;

  @IsOptional()
  @IsBoolean()
  enable_staff_scheduling_sync?: boolean;

  @IsOptional()
  @IsString()
  scheduling_provider?: string;

  @IsOptional()
  @IsBoolean()
  enable_webhook_notifications?: boolean;

  @IsOptional()
  @IsString()
  webhook_url?: string;

  @IsOptional()
  @IsString()
  webhook_secret_key?: string;

  @IsOptional()
  @IsArray()
  webhook_events?: string[];

  @IsOptional()
  @IsString()
  api_key?: string;

  @IsOptional()
  @IsString()
  api_secret?: string;
}
