import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
  username: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Prop({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Prop({ required: true })
  @IsString()
  @Length(8, 128)
  password: string;

  @Prop()
  @IsString()
  @IsOptional()
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

  @Prop({ default: false })
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
