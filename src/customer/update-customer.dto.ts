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

  @IsOptional()
  @IsString({ message: 'Remarks must be a string' })
  remarks: string;

  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;
}
