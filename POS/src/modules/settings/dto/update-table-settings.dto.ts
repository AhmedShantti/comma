import { IsOptional, IsBoolean, IsString, IsInt } from 'class-validator';

export class UpdateTableSettingsDto {
  @IsOptional()
  @IsInt()
  default_table_count?: number;

  @IsOptional()
  @IsBoolean()
  enable_qr_codes?: boolean;

  @IsOptional()
  @IsString()
  qr_code_format?: 'url' | 'text';

  @IsOptional()
  @IsString()
  qr_prefix_url?: string;

  @IsOptional()
  @IsBoolean()
  enable_table_transfer?: boolean;

  @IsOptional()
  @IsBoolean()
  table_merge_enabled?: boolean;

  @IsOptional()
  @IsInt()
  auto_reserve_duration_minutes?: number;
}
