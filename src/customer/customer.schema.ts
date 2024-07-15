import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsNotEmpty, IsString, IsPhoneNumber, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type CustomerDocument = Customer & Document;

@Schema()
export class Customer {
  @Prop({ unique: true })
  code: string;

  @Prop({ required: true })
  @IsString({ message: 'Image URL must be a string' })
  @IsNotEmpty({ message: 'Image URL is required' })
  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Product image URL',
  })
  image: string;

  @Prop({ required: true })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  name: string;

  @Prop({ required: true, unique: true })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty({ example: 'string@yopmail.com', description: 'string' })
  email: string;

  @Prop({ required: true, unique: true })
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('IN', {
    message: 'Phone number must be a valid Indian phone number',
  })
  @ApiProperty({ example: 'string', description: '1234567891' })
  phone: string;

  @Prop({ required: true })
  @IsString({ message: 'Village must be a string' })
  @IsNotEmpty({ message: 'Village is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  village: string;

  @Prop({ required: true, unique: true })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  username: string;

  @Prop({ required: true })
  @IsString({ message: 'Gender must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  gender: string;

  @Prop({ default: true })
  status: boolean;

  @Prop()
  @IsString({ message: 'Remarks must be a string' })
  @IsNotEmpty({ message: 'Remarks is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  remarks: string;

  @Prop()
  createdBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedBy: string;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.pre('save', function (next) {
  const product = this as CustomerDocument;
  product.updatedAt = new Date();
  next();
});

CustomerSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

CustomerSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
