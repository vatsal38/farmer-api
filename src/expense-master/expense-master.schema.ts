import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IsNotEmpty,
  IsBoolean,
  IsString,
  IsPhoneNumber,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

export type ExpenseMasterDocument = ExpenseMaster & Document;

@Schema()
export class ExpenseMaster {
  @Prop({ required: true })
  @IsString({ message: 'Image URL must be a string' })
  @IsNotEmpty({ message: 'Image URL is required' })
  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Product image URL',
  })
  image: string;

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
  @ApiProperty({ example: 'string', description: '9999966666' })
  phone: string;

  @Prop({ default: true })
  status: boolean;

  @Prop()
  @IsString({ message: 'Remarks must be a string' })
  @ApiProperty({ example: 'string', description: 'string' })
  remarks: string;

  @Prop({ default: uuidv4 })
  unique_id: string;

  @Prop()
  createdBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedBy: string;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ExpenseMasterSchema = SchemaFactory.createForClass(ExpenseMaster);

ExpenseMasterSchema.pre('save', function (next) {
  const product = this as ExpenseMasterDocument;
  product.updatedAt = new Date();
  next();
});

ExpenseMasterSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

ExpenseMasterSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
