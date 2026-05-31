import { IsOptional, IsBoolean, IsString, IsArray, IsInt } from 'class-validator';

export class UpdateReportSettingsDto {
  @IsOptional()
  @IsBoolean()
  auto_daily_reports?: boolean;

  @IsOptional()
  @IsString()
  daily_report_time?: string;

  @IsOptional()
  @IsArray()
  daily_report_recipients?: string[];

  @IsOptional()
  @IsBoolean()
  auto_weekly_reports?: boolean;

  @IsOptional()
  @IsInt()
  weekly_report_day?: number;

  @IsOptional()
  @IsString()
  weekly_report_time?: string;

  @IsOptional()
  @IsArray()
  weekly_report_recipients?: string[];

  @IsOptional()
  @IsBoolean()
  enable_profit_margins?: boolean;

  @IsOptional()
  @IsBoolean()
  enable_sales_by_category?: boolean;

  @IsOptional()
  @IsBoolean()
  enable_inventory_reports?: boolean;

  @IsOptional()
  @IsBoolean()
  enable_staff_performance?: boolean;

  @IsOptional()
  @IsString()
  export_format_default?: 'pdf' | 'excel' | 'csv';
}
