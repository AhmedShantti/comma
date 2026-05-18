import { IsOptional, IsDateString, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ReportType } from '../enums/report-type.enum';

export class DailyReportQueryDto {
  @ApiPropertyOptional({ example: '2025-01-15' })
  @IsOptional()
  @IsDateString()
  date?: string;
}

export class WeeklyReportQueryDto {
  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(53)
  week?: number;

  @ApiPropertyOptional({ example: 2025 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2020)
  year?: number;
}

export class MonthlyReportQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @ApiPropertyOptional({ example: 2025 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2020)
  year?: number;
}

export class DateRangeQueryDto {
  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ example: '2025-01-31' })
  @IsOptional()
  @IsDateString()
  to?: string;
}

export class YearQueryDto {
  @ApiPropertyOptional({ example: 2025 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2020)
  year?: number;
}

export class ReportLogQueryDto {
  @ApiPropertyOptional({ enum: ReportType })
  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
