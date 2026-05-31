import { IsOptional, IsBoolean, IsString } from 'class-validator';

export class UpdateNotificationSettingsDto {
  @IsOptional()
  @IsBoolean()
  email_notifications_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  sms_notifications_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  push_notifications_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  in_app_notifications_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  notify_on_new_orders?: boolean;

  @IsOptional()
  @IsBoolean()
  notify_on_payment_received?: boolean;

  @IsOptional()
  @IsBoolean()
  notify_on_staff_late?: boolean;

  @IsOptional()
  @IsBoolean()
  notify_on_low_inventory?: boolean;

  @IsOptional()
  @IsString()
  notification_email_address?: string;

  @IsOptional()
  @IsString()
  notification_phone_number?: string;

  @IsOptional()
  @IsBoolean()
  quiet_hours_enabled?: boolean;

  @IsOptional()
  @IsString()
  quiet_hours_start?: string;

  @IsOptional()
  @IsString()
  quiet_hours_end?: string;
}
