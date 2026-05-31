import { IsOptional, IsBoolean, IsArray, IsInt } from 'class-validator';

export class UpdateSecuritySettingsDto {
  @IsOptional()
  @IsBoolean()
  ip_whitelist_enabled?: boolean;

  @IsOptional()
  @IsArray()
  ip_whitelist?: string[];

  @IsOptional()
  @IsBoolean()
  ip_blacklist_enabled?: boolean;

  @IsOptional()
  @IsArray()
  ip_blacklist?: string[];

  @IsOptional()
  @IsBoolean()
  enforce_https_only?: boolean;

  @IsOptional()
  @IsBoolean()
  cors_enabled?: boolean;

  @IsOptional()
  @IsArray()
  cors_origins?: string[];

  @IsOptional()
  @IsBoolean()
  csrf_protection_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  audit_logging_enabled?: boolean;

  @IsOptional()
  @IsInt()
  audit_log_retention_days?: number;

  @IsOptional()
  @IsBoolean()
  data_encryption_enabled?: boolean;

  @IsOptional()
  @IsInt()
  require_password_reset_days?: number;

  @IsOptional()
  @IsInt()
  suspicious_activity_threshold?: number;
}
