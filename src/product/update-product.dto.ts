import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'Image should be in string format' })
  image?: string;

  @IsOptional()
  @IsString({ message: 'Product name should be a string' })
  productName?: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'], {
    message: 'Type must be either "active" or "inactive"',
  })
  type?: string;
}
