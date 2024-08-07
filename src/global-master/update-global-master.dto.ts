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

export class GlobalMasterDto {
  @IsOptional()
  @IsString({ message: 'first name must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  fname?: string;

  @IsOptional()
  @IsString({ message: 'last name must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  lname?: string;

  @IsOptional()
  @IsString({ message: 'home must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  home?: string;

  @IsOptional()
  @IsString({ message: 'streetAddress must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  streetAddress?: string;

  @IsOptional()
  @IsString({ message: 'cityCountry must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  cityCountry?: string;

  @IsOptional()
  @IsString({ message: 'comment must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  comment?: string;

  @IsOptional()
  @IsString({ message: 'marketFees must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  marketFees?: string;

  @IsOptional()
  @IsString({ message: 'commission must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  commission?: string;

  @IsOptional()
  @IsString({ message: 'bhada must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  bhada?: string;

  @IsOptional()
  @IsString({ message: 'stemp must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  stemp?: string;

  @IsOptional()
  @IsString({ message: 'hamali must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  hamali?: string;

  @IsOptional()
  @IsString({ message: 'varai must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  varai?: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('IN', {
    message: 'Phone number must be a valid Indian phone number',
  })
  @ApiProperty({ example: '9999966666', description: '9999966666' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'fax must be a string' })
  @ApiProperty({ example: '9999966666', description: '9999966666' })
  fax?: string;

  @IsOptional()
  @IsString({ message: 'Email must be a string' })
  @ApiProperty({ example: 'string@yopmail.com', description: 'string' })
  email?: string;

  @IsOptional()
  @ApiProperty({ example: 'true', description: 'boolean' })
  isPayment?: boolean;
}
