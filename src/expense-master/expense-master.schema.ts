import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IsNotEmpty,
  IsBoolean,
  IsString,
  IsPhoneNumber,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export type ExpenseMasterDocument = ExpenseMaster & Document;

@Schema()
export class ExpenseMaster {
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

  @Prop({ default: true })
  status: boolean;

  @Prop()
  @IsString({ message: 'Remarks must be a string' })
  remarks: string;

  @Prop({ default: uuidv4 })
  unique_id: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
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
