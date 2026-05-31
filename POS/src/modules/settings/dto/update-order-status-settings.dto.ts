import { IsOptional, IsArray, IsObject } from 'class-validator';
import { OrderStatus, TransitionRule } from '../entities/order-status-settings.entity';

export class UpdateOrderStatusSettingsDto {
  @IsOptional()
  @IsArray()
  statuses?: OrderStatus[];

  @IsOptional()
  @IsArray()
  transition_rules?: TransitionRule[];
}

export class CreateCustomStatusDto {
  @IsOptional()
  name: string;

  @IsOptional()
  displayColor: string;

  @IsOptional()
  isTerminal: boolean;
}
