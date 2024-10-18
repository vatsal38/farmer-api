import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsPhoneNumber,
  IsNumber,
  Min,
  Max,
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
  @IsNumber()
  @ApiProperty({ example: 0, description: 'string' })
  @Min(0, { message: 'App Commission cannot be negative' })
  @Max(100, { message: 'App Commission must be less than 100' })
  commission?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 0, description: 'string' })
  @Min(0, { message: 'App Commission cannot be negative' })
  @Max(100, { message: 'App Commission must be less than 100' })
  bhada?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 0, description: 'string' })
  @Min(0, { message: 'App Commission cannot be negative' })
  @Max(100, { message: 'App Commission must be less than 100' })
  stemp?: number;

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

  @IsString({ message: 'postage must be a string' })
  @IsOptional()
  @ApiProperty({ example: 'string', description: 'string' })
  postage?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 0, description: 'string' })
  @Min(0, { message: 'App Commission cannot be negative' })
  @Max(100, { message: 'App Commission must be less than 100' })
  appCommission?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 0, description: 'string' })
  @Min(0, { message: 'App Commission cannot be negative' })
  @Max(100, { message: 'App Commission must be less than 100' })
  webCommission?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 0, description: 'string' })
  @Min(0, { message: 'App Commission cannot be negative' })
  @Max(100, { message: 'App Commission must be less than 100' })
  basePrice?: number;
}
