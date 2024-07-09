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
  name?: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('IN', {
    message: 'Phone number must be a valid Indian phone number',
  })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Village must be a string' })
  village?: string;

  @IsOptional()
  @IsString({ message: 'Gender must be a string' })
  gender?: string;

  @IsOptional()
  @IsBoolean({ message: 'Status should be boolean' })
  status?: boolean;

  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  image?: string;
}
