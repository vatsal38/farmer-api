import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsBoolean,
  IsEmail,
  Length,
  IsOptional,
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
  firstName: string;

  @Prop({ required: true })
  @IsString({ message: 'last name must be a string' })
  @IsNotEmpty({ message: 'last name is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  lastName: string;

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
  @IsString({ message: 'commission must be a string' })
  @IsNotEmpty({ message: 'commission is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  commission: string;

  @Prop({ required: true })
  @IsString({ message: 'bhada must be a string' })
  @IsNotEmpty({ message: 'bhada is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  bhada: string;

  @Prop({ required: true })
  @IsString({ message: 'stemp must be a string' })
  @IsNotEmpty({ message: 'stemp is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  stemp: string;

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

  @Prop({ default: false })
  isPayment: boolean;

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
