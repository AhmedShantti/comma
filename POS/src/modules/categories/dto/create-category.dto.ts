import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  name_ar: string;

  @ApiProperty()
  @IsString()
  name_en: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sort_order?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name_ar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name_en?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sort_order?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class ReorderCategoryDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNumber()
  sort_order: number;
}
