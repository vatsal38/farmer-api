import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsOptional,
  IsPhoneNumber,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class UpdateBankDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  address?: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('IN', {
    message: 'Phone number must be a valid Indian phone number',
  })
  @ApiProperty({
    example: '4455663322',
    description: 'string',
    required: false,
  })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  remarks?: string;

  @IsOptional()
  @IsString({ message: 'Opening Balance must be a number' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  openingBalance?: number;
}
