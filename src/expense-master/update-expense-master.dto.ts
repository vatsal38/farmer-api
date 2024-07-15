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

export class UpdateExpenseMasterDto {
  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Product image URL',
    required: false,
  })
  image?: string;

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
  @IsBoolean({ message: 'Status should be boolean' })
  @ApiProperty({ example: true, description: 'string', required: false })
  status?: boolean;

  @IsOptional()
  @IsString({ message: 'Remarks must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  remarks?: string;
}
