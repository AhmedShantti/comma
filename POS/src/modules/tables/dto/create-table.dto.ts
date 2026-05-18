import { IsInt, IsOptional, IsString, Min, Max, IsEnum } from 'class-validator';
import { TableStatus } from '../entities/table.entity';

export class CreateTableDto {
  @IsInt()
  @Min(1)
  @Max(999)
  table_number: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  capacity?: number;

  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTableDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(999)
  table_number?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  capacity?: number;

  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
