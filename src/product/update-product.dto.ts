import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'Image should be in string format' })
  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Product image URL',
    required: false,
  })
  image?: string;

  @IsOptional()
  @IsString({ message: 'Product name should be a string' })
  @ApiProperty({
    example: 'Product Name',
    description: 'Product name',
    required: false,
  })
  productName?: string;

  @IsOptional()
  @IsString({ message: 'Type should be a string' })
  // @IsIn(['active', 'inactive'], {
  //   message: 'Type must be either "active" or "inactive"',
  // })
  @ApiProperty({
    example: 'active',
    description: 'Product type',
    required: false,
  })
  type?: string;

  @IsOptional()
  // @IsBoolean({ message: 'Status should be a true or false' })
  @ApiProperty({
    example: true,
    description: 'Product status',
    required: false,
  })
  status?: boolean;
}
