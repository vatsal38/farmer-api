import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';

export class AccessManagerDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'John' })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '6356368324' })
  number?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'john.doe@example.com' })
  email?: string;

  @IsOptional()
  @ApiProperty({ example: false })
  isWeb?: boolean;

  @IsOptional()
  @ApiProperty({ example: false })
  isAndroid?: boolean;

  @IsOptional()
  @ApiProperty({ example: false })
  isVerified?: boolean;
}
