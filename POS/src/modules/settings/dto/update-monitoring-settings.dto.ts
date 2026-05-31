import { IsOptional, IsBoolean, IsString, IsArray, IsInt } from 'class-validator';

export class UpdateMonitoringSettingsDto {
  @IsOptional()
  @IsBoolean()
  error_tracking_enabled?: boolean;

  @IsOptional()
  @IsString()
  error_tracking_provider?: string;

  @IsOptional()
  @IsBoolean()
  uptime_monitoring_enabled?: boolean;

  @IsOptional()
  @IsInt()
  uptime_check_interval_minutes?: number;

  @IsOptional()
  @IsBoolean()
  database_performance_monitoring?: boolean;

  @IsOptional()
  @IsInt()
  api_response_time_threshold_ms?: number;

  @IsOptional()
  @IsInt()
  alert_low_disk_space_threshold_percent?: number;

  @IsOptional()
  @IsInt()
  alert_high_cpu_threshold_percent?: number;

  @IsOptional()
  @IsArray()
  alert_email_recipients?: string[];

  @IsOptional()
  @IsInt()
  performance_log_retention_days?: number;
}
