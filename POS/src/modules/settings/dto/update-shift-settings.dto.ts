import { IsOptional, IsBoolean, IsInt, IsString } from 'class-validator';

export class UpdateShiftSettingsDto {
  @IsOptional()
  @IsInt()
  shift_duration_minutes?: number;

  @IsOptional()
  @IsBoolean()
  allow_shift_overlap?: boolean;

  @IsOptional()
  @IsBoolean()
  auto_clock_out_enabled?: boolean;

  @IsOptional()
  @IsInt()
  auto_clock_out_minutes?: number;

  @IsOptional()
  @IsInt()
  break_duration_minutes?: number;

  @IsOptional()
  @IsInt()
  breaks_per_shift?: number;

  @IsOptional()
  @IsBoolean()
  allow_manual_clock_in_out?: boolean;

  @IsOptional()
  @IsBoolean()
  warn_long_shifts?: boolean;

  @IsOptional()
  @IsInt()
  warn_long_shift_hours?: number;

  @IsOptional()
  @IsBoolean()
  payroll_integration_enabled?: boolean;

  @IsOptional()
  @IsString()
  payroll_provider?: string;
}
