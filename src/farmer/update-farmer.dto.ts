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

export class UpdateFarmerDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('IN', {
    message: 'Phone number must be a valid Indian phone number',
  })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Village must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  village?: string;

  @IsOptional()
  @IsString({ message: 'Gender must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  gender?: string;

  @IsOptional()
  @ApiProperty({ example: true, description: 'true', required: false })
  // @IsBoolean({ message: 'Status should be boolean' })
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
  @ApiProperty({
    example: 'string@yopmail.com',
    description: 'string',
    required: false,
  })
  email?: string;
}
