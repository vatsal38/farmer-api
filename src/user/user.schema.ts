import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'string', description: 'string' })
  username: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'string', description: 'string' })
  firstName: string;

  @Prop({ required: true })
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'string', description: 'string' })
  email: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'string', description: 'string' })
  lastName: string;

  @Prop({ required: true })
  @IsString()
  @Length(8, 128)
  @ApiProperty({ example: 'string', description: 'string' })
  password: string;

  @Prop()
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'string', description: 'string' })
  otp: string;

  @Prop({ default: 'admin' })
  @IsString()
  @IsOptional()
  role: string;

  @Prop()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  otpExpiration: Date;

  @Prop({ default: false })
  @IsBoolean()
  @IsOptional()
  isVerified: boolean;

  @Prop({ default: true })
  @IsBoolean()
  @IsOptional()
  isProduct: boolean;

  @Prop()
  @IsString()
  @IsOptional()
  resetOtp: string;

  @Prop()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  resetOtpExpiration: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
