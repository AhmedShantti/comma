import { IsOptional, IsString } from 'class-validator';

export class UpdateBusinessSettingsDto {
  @IsOptional()
  @IsString()
  restaurant_name?: string;

  @IsOptional()
  @IsString()
  restaurant_phone?: string;

  @IsOptional()
  @IsString()
  restaurant_email?: string;

  @IsOptional()
  @IsString()
  business_address?: string;

  @IsOptional()
  @IsString()
  business_city?: string;

  @IsOptional()
  @IsString()
  business_postal_code?: string;

  @IsOptional()
  @IsString()
  business_license_number?: string;

  @IsOptional()
  @IsString()
  tax_id?: string;

  @IsOptional()
  @IsString()
  currency_code?: string;

  @IsOptional()
  @IsString()
  owner_name?: string;

  @IsOptional()
  @IsString()
  owner_email?: string;
}
