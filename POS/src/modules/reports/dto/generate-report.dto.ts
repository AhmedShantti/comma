import { IsOptional, IsDateString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateDailyDto {
  @ApiPropertyOptional({ example: '2025-01-15' })
  @IsOptional()
  @IsDateString()
  date?: string;
}

export class GenerateWeeklyDto {
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

export class GenerateMonthlyDto {
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

export class BulkGenerateDto {
  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ example: '2025-01-31' })
  @IsOptional()
  @IsDateString()
  to?: string;
}
