import { IsString, IsNumber, IsOptional, IsBoolean, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateVariantDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  price_adjustment: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class CreateMenuItemDto {
  @ApiProperty()
  @IsUUID()
  category_id: string;

  @ApiProperty()
  @IsString()
  name_ar: string;

  @ApiProperty()
  @IsString()
  name_en: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_ar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_en?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  base_price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tax_group?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sort_order?: number;

  @ApiPropertyOptional({ type: [CreateVariantDto] })
  @IsOptional()
  variants?: CreateVariantDto[];

  @ApiPropertyOptional()
  @IsOptional()
  addon_ids?: string[];
}

export class UpdateMenuItemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  category_id?: string;

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
  @IsString()
  description_ar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_en?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  base_price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sort_order?: number;
}
