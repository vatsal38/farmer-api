import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsBoolean,
  IsEmail,
  Length,
} from 'class-validator';

export type FarmerDocument = Farmer & Document;

@Schema()
export class Farmer {
  @Prop({ unique: true })
  code: string;

  @Prop({ required: true })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @Prop({ required: true })
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('IN', {
    message: 'Phone number must be a valid Indian phone number',
  })
  phone: string;

  @Prop({ required: true })
  @IsString({ message: 'Village must be a string' })
  @IsNotEmpty({ message: 'Village is required' })
  village: string;

  @Prop({ required: true })
  @IsString({ message: 'Gender must be a string' })
  gender: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ required: true })
  @IsString({ message: 'Image URL must be a string' })
  @IsNotEmpty({ message: 'Image URL is required' })
  image: string;

  @Prop({ required: true })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

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
