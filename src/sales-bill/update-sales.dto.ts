// update-sales.dto.ts
import { IsOptional, IsMongoId, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBillDto {
  @ApiProperty({
    description: 'The ID of the product',
    example: 'product123',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  productId?: string;

  @ApiProperty({
    description: 'Weight of the product',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty({
    description: 'Price of the product',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ description: 'Number of bags', example: 2, required: false })
  @IsOptional()
  @IsNumber()
  bags?: number;

  @ApiProperty({
    description: 'Final amount after calculations',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  finalAmount?: number;

  @ApiProperty({
    description: 'Type of the transaction',
    example: 'sale',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;
}
