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
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type BankDocument = Bank & Document;

@Schema()
export class Bank {
  @Prop()
  code: string;

  @Prop({ required: true })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  name: string;

  @Prop({ required: true })
  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  address: string;

  @Prop({ required: true, unique: true })
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('IN', {
    message: 'Phone number must be a valid Indian phone number',
  })
  @ApiProperty({ example: '9988774455', description: '1234567891' })
  phone: string;

  @Prop({ required: true })
  @IsString({ message: 'Remark must be a string' })
  @IsNotEmpty({ message: 'Remark is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  remarks: string;

  @Prop({ required: true })
  @IsNumber()
  @IsNotEmpty({ message: 'Opening Balance is required' })
  @ApiProperty({ example: 0, description: 'string' })
  openingBalance: number;

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

export const BankSchema = SchemaFactory.createForClass(Bank);

BankSchema.pre('save', function (next) {
  const bank = this as BankDocument;
  bank.updatedAt = new Date();
  next();
});

BankSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

BankSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
