import { IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 20;

  @ApiPropertyOptional({ default: 'created_at' })
  @IsOptional()
  sort?: string = 'created_at';

  @ApiPropertyOptional({ default: 'desc' })
  @IsOptional()
  order?: 'asc' | 'desc' = 'desc';

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
