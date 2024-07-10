import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'Image is required' })
  image: string;

  @Prop({ unique: true })
  code: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  productName: string;

  @Prop({ required: true, enum: ['active', 'inactive'] })
  @IsString()
  @IsIn(['active', 'inactive'], {
    message: 'Type must be either "active" or "inactive"',
  })
  type: string;

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
