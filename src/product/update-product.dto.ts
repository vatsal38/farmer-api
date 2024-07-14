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
  image?: string;

  @IsOptional()
  @IsString({ message: 'Product name should be a string' })
  productName?: string;

  @IsOptional()
  @IsString({ message: 'Type should be a string' })
  // @IsIn(['active', 'inactive'], {
  //   message: 'Type must be either "active" or "inactive"',
  // })
  type?: string;

  @IsOptional()
  @IsBoolean({ message: 'Status should be a true or false' })
  status?: boolean;
}
