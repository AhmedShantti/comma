import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAddonDto {
  @ApiProperty()
  @IsString()
  name_ar: string;

  @ApiProperty()
  @IsString()
  name_en: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateAddonDto {
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
  @Min(0)
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
