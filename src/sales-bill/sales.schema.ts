// sales.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsMongoId, IsOptional } from 'class-validator';
import { platform } from 'os';

export interface Bill {
  productId: string;
  weight: number;
  price: number;
  bags: number;
  createdBy: string;
  finalAmount: number;
  type: string;
}

export type SalesDocument = Sales & Document;

@Schema()
export class BillSchema {
  @Prop()
  @ApiProperty({ description: 'The ID of the product', example: 'product123' })
  @IsOptional()
  @IsMongoId()
  productId: string;

  @Prop()
  @ApiProperty({ description: 'Weight of the product', example: 100 })
  @IsOptional()
  weight: number;

  @Prop()
  @ApiProperty({ description: 'Price of the product', example: 50 })
  @IsOptional()
  price: number;

  @Prop()
  @IsOptional()
  @ApiProperty({ description: 'Platform of the product', example: 'web' })
  @IsIn(['web', 'app'], { message: 'loginType must be either "web" or "app"' })
  platform: string;

  @Prop()
  @IsOptional()
  @ApiProperty({ description: 'Number of bags', example: 2 })
  bags: number;

  @Prop()
  @IsOptional()
  @IsMongoId()
  user: string;

  @Prop()
  @IsOptional()
  @ApiProperty({ description: 'Final amount after calculations', example: 100 })
  finalAmount: number;

  @Prop()
  @IsOptional()
  @ApiProperty({ description: 'Type of the transaction', example: 'sale' })
  type: string;
}

@Schema()
export class Sales {
  @Prop()
  @IsOptional()
  @IsMongoId()
  @ApiProperty({ description: 'The ID of the farmer', example: 'farmer123' })
  farmerId: string;

  @ApiProperty({
    description: 'List of bills for the sales',
    type: [BillSchema],
    example: [
      {
        productId: 'product123',
        weight: 100,
        price: 50,
        bags: 2,
        platform: 'web',
        createdBy: 'user',
        finalAmount: 100,
        type: 'sale',
      },
    ],
  })
  @Prop({ type: [BillSchema], required: true })
  @IsOptional()
  billList: BillSchema[];

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

export const SalesSchema = SchemaFactory.createForClass(Sales);
