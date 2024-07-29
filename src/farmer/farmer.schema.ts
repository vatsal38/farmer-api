import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsBoolean,
  IsEmail,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type FarmerDocument = Farmer & Document;

@Schema()
export class Farmer {
  @Prop({ unique: true })
  code: string;

  @Prop({ required: true })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  name: string;

  @Prop({ required: true, unique: true })
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('IN', {
    message: 'Phone number must be a valid Indian phone number',
  })
  @ApiProperty({ example: '9999966666', description: '9999966666' })
  phone: string;

  @Prop({ required: true })
  @IsString({ message: 'Village must be a string' })
  @IsNotEmpty({ message: 'Village is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  village: string;

  @Prop({ required: true })
  @IsString({ message: 'Gender must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  gender: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ required: true, unique: true })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  username: string;

  @Prop({ required: true })
  @IsString({ message: 'Image URL must be a string' })
  @IsNotEmpty({ message: 'Image URL is required' })
  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Product image URL',
  })
  image: string;

  @Prop({ required: true, unique: true })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty({ example: 'string@yopmail.com', description: 'string' })
  email: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop()
  createdBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedBy: string;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const FarmerSchema = SchemaFactory.createForClass(Farmer);

FarmerSchema.pre('save', function (next) {
  const product = this as FarmerDocument;
  product.updatedAt = new Date();
  next();
});

FarmerSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

FarmerSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
