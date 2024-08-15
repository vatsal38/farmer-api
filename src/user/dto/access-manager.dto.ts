import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class AccessManagerDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'John' })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '6356368324' })
  number?: string;
}
