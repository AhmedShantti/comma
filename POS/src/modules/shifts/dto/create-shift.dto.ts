import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShiftDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  opening_cash: number;
}

export class CloseShiftDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  closing_cash: number;

  @ApiProperty({ required: false })
  notes?: string;
}
