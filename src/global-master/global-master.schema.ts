import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type GlobalMasterDocument = GlobalMaster & Document;

@Schema()
export class GlobalMaster {
  @Prop({ unique: true })
  code: string;

  @Prop({ required: true })
  @IsString({ message: 'first name must be a string' })
  @IsNotEmpty({ message: 'first name is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  fname: string;

  @Prop({ required: true })
  @IsString({ message: 'last name must be a string' })
  @IsNotEmpty({ message: 'last name is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  lname: string;

  @Prop({ required: true })
  @IsString({ message: 'home must be a string' })
  @IsNotEmpty({ message: 'home is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  home: string;

  @Prop({ required: true })
  @IsString({ message: 'streetAddress must be a string' })
  @IsNotEmpty({ message: 'streetAddress is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  streetAddress: string;

  @Prop({ required: true })
  @IsString({ message: 'cityCountry must be a string' })
  @IsNotEmpty({ message: 'cityCountry is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  cityCountry: string;

  @Prop({ required: true })
  @IsString({ message: 'comment must be a string' })
  @IsNotEmpty({ message: 'comment is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  comment: string;

  @Prop({ required: true })
  @IsString({ message: 'marketFees must be a string' })
  @IsNotEmpty({ message: 'marketFees is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  marketFees: string;

  @Prop({ required: true })
  @IsNumber()
  @IsNotEmpty({ message: 'commission is required' })
  @ApiProperty({ example: 0, description: 'string' })
  @Min(0, { message: 'App Commission cannot be negative' })
  @Max(100, { message: 'App Commission must be less than 100' })
  commission: number;

  @Prop({ required: true })
  @IsNumber()
  @IsNotEmpty({ message: 'bhada is required' })
  @ApiProperty({ example: 0, description: 'string' })
  @Min(0, { message: 'App Commission cannot be negative' })
  @Max(100, { message: 'App Commission must be less than 100' })
  bhada: number;

  @Prop({ required: true })
  @IsNumber()
  @IsNotEmpty({ message: 'stemp is required' })
  @ApiProperty({ example: 0, description: 'string' })
  @Min(0, { message: 'App Commission cannot be negative' })
  @Max(100, { message: 'App Commission must be less than 100' })
  stemp: number;

  @Prop({ required: true })
  @IsString({ message: 'hamali must be a string' })
  @IsNotEmpty({ message: 'hamali is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  hamali: string;

  @Prop({ required: true })
  @IsString({ message: 'varai must be a string' })
  @IsNotEmpty({ message: 'varai is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  varai: string;

  @Prop({ required: true, unique: true })
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('IN', {
    message: 'Phone number must be a valid Indian phone number',
  })
  @ApiProperty({ example: '9999966666', description: '9999966666' })
  phone: string;

  @Prop({ required: true, unique: true })
  @IsString({ message: 'fax must be a string' })
  @ApiProperty({ example: '9999966666', description: '9999966666' })
  fax: string;

  @Prop({ required: true, unique: true })
  @IsString({ message: 'Email must be a string' })
  @ApiProperty({ example: 'string@yopmail.com', description: 'string' })
  email: string;

  @Prop({ required: true })
  @IsNotEmpty({ message: 'isPayment is required' })
  @ApiProperty({ example: 'true', description: 'boolean' })
  isPayment: boolean;

  @Prop({ required: true })
  @IsString({ message: 'postage must be a string' })
  @IsNotEmpty({ message: 'postage is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  postage: string;

  @Prop({ required: true })
  @IsNumber()
  @IsNotEmpty({ message: 'App Commission is required' })
  @ApiProperty({ example: 0, description: 'string' })
  @Min(0, { message: 'App Commission cannot be negative' })
  @Max(100, { message: 'App Commission must be less than 100' })
  appCommission: number;

  @Prop({ required: true })
  @IsNumber()
  @IsNotEmpty({ message: 'Web Commission is required' })
  @ApiProperty({ example: 0, description: 'string' })
  @Min(0, { message: 'App Commission cannot be negative' })
  @Max(100, { message: 'App Commission must be less than 100' })
  webCommission: number;

  @Prop({ required: true })
  @IsNumber()
  @IsNotEmpty({ message: 'Base Price is required' })
  @ApiProperty({ example: 0, description: 'string' })
  @Min(0, { message: 'App Commission cannot be negative' })
  @Max(100, { message: 'App Commission must be less than 100' })
  basePrice: number;

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

export const GlobalMasterSchema = SchemaFactory.createForClass(GlobalMaster);

GlobalMasterSchema.pre('save', function (next) {
  const globalMasterDocument = this as GlobalMasterDocument;
  globalMasterDocument.updatedAt = new Date();
  next();
});

GlobalMasterSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

GlobalMasterSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
