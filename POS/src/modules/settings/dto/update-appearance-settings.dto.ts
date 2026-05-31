import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateAppearanceSettingsDto {
  @IsOptional()
  @IsString()
  primary_color?: string;

  @IsOptional()
  @IsString()
  secondary_color?: string;

  @IsOptional()
  @IsBoolean()
  dark_mode_enabled?: boolean;

  @IsOptional()
  @IsString()
  font_family?: string;

  @IsOptional()
  @IsString()
  logo_url?: string;

  @IsOptional()
  @IsString()
  favicon_url?: string;

  @IsOptional()
  @IsString()
  invoice_header_text?: string;

  @IsOptional()
  @IsString()
  invoice_footer_text?: string;

  @IsOptional()
  @IsString()
  receipt_header_text?: string;

  @IsOptional()
  @IsString()
  receipt_footer_text?: string;

  @IsOptional()
  @IsString()
  theme_preset?: 'modern' | 'elegant' | 'minimal' | 'casual';

  @IsOptional()
  @IsString()
  custom_css?: string;
}
