import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(product: Product): Promise<Product> {
    const newProduct = new this.productModel(product);
    return newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    return this.productModel
      .findByIdAndUpdate(id, product, { new: true, runValidators: true })
      .exec();
  }

  async remove(id: string): Promise<Product> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async findByProductName(productName: string): Promise<Product | null> {
    return this.productModel.findOne({ productName }).exec();
  }

  async findWithPagination(skip: number, limit: number): Promise<Product[]> {
    return this.productModel.find().skip(skip).limit(limit).exec();
  }

  async countAll(): Promise<number> {
    return this.productModel.countDocuments().exec();
  }
}
