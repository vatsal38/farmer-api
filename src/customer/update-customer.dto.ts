import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsPhoneNumber,
  IsBoolean,
  IsEmail,
} from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('IN', {
    message: 'Phone number must be a valid Indian phone number',
  })
  @ApiProperty({
    example: 'string',
    description: '1234567789',
    required: false,
  })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Village must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  village?: string;

  @IsOptional()
  @IsString({ message: 'Gender must be a string' })
  @ApiProperty({ example: 'male', description: 'string', required: false })
  gender?: string;

  @IsOptional()
  // @IsBoolean({ message: 'Status should be boolean' })
  @ApiProperty({ example: true, description: 'string', required: false })
  status?: boolean;

  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Product image URL',
    required: false,
  })
  image?: string;

  @IsOptional()
  @IsString({ message: 'Remarks must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  remarks: string;

  @IsOptional()
  @ApiProperty({
    example: 'string@yopmail.com',
    description: 'string',
    required: false,
  })
  email?: string;
}
