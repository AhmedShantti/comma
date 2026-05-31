import { IsOptional, IsBoolean, IsString, IsInt } from 'class-validator';

export class UpdateMenuSettingsDto {
  @IsOptional()
  @IsBoolean()
  hide_sold_out_items?: boolean;

  @IsOptional()
  @IsBoolean()
  show_item_descriptions?: boolean;

  @IsOptional()
  @IsBoolean()
  enable_addons?: boolean;

  @IsOptional()
  @IsBoolean()
  enable_variants?: boolean;

  @IsOptional()
  @IsBoolean()
  enable_allergen_warnings?: boolean;

  @IsOptional()
  @IsString()
  default_portion_size?: 'small' | 'medium' | 'large';

  @IsOptional()
  @IsBoolean()
  show_item_images?: boolean;

  @IsOptional()
  @IsBoolean()
  enable_menu_search?: boolean;

  @IsOptional()
  @IsInt()
  items_per_page?: number;
}
