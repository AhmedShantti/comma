import { IsOptional, IsBoolean, IsInt, IsArray } from 'class-validator';

export class UpdateUserManagementSettingsDto {
  @IsOptional()
  @IsInt()
  password_min_length?: number;

  @IsOptional()
  @IsBoolean()
  password_require_uppercase?: boolean;

  @IsOptional()
  @IsBoolean()
  password_require_numbers?: boolean;

  @IsOptional()
  @IsBoolean()
  password_require_special_chars?: boolean;

  @IsOptional()
  @IsInt()
  session_timeout_minutes?: number;

  @IsOptional()
  @IsBoolean()
  require_2fa?: boolean;

  @IsOptional()
  @IsBoolean()
  enable_email_login?: boolean;

  @IsOptional()
  @IsArray()
  email_domain_restrictions?: string[];

  @IsOptional()
  @IsInt()
  auto_disable_inactive_users_days?: number;
}
