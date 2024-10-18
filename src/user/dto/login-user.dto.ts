import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsNotEmpty, Length, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @ApiProperty({ example: 'john_doe' })
  username: string;

  @IsString()
  @Length(8, 128)
  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ example: 'password123' })
  password: string;

  @IsString()
  @IsIn(['web', 'app'], { message: 'loginType must be either "web" or "app"' })
  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ example: 'web' })
  loginType: string;
}
