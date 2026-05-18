import { IsString, IsEmail, MinLength, IsEnum, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../common/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d{4,6}$/, { message: 'PIN must be 4-6 digits' })
  pin?: string;

  @ApiProperty()
  @IsString()
  full_name: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
