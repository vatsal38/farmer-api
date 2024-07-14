import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IsNotEmpty, IsString, IsIn, IsBoolean } from 'class-validator';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  @IsString({ message: 'Image must be a string' })
  @IsNotEmpty({ message: 'Image is required' })
  image: string;

  @Prop({ unique: true })
  code: string;

  @Prop({ required: true, unique: true })
  @IsString({ message: 'Product name must be a string' })
  @IsNotEmpty({ message: 'Product name is required' })
  productName: string;

  @Prop({ required: true })
  @IsString({ message: 'Type must be a string' })
  // @IsIn(['active', 'inactive'], {
  //   message: 'Type must be either "active" or "inactive"',
  // })
  // enum: ['active', 'inactive']
  type: string;

  @Prop({ default: true })
  status: boolean;

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

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre('save', function (next) {
  const product = this as ProductDocument;
  product.updatedAt = new Date();
  next();
});

ProductSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

ProductSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
