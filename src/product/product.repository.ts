import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(product: Product, userId: string): Promise<Product> {
    product.createdBy = userId;
    product.user = userId;
    const newProduct = new this.productModel(product);
    return newProduct.save();
  }

  async findAll(userId: string, isSuperAdmin?: boolean): Promise<Product[]> {
    if (isSuperAdmin) {
      return this.productModel.find().exec();
    } else {
      return this.productModel.find({ createdBy: userId }).exec();
    }
  }

  async findOne(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    return this.productModel
      .findByIdAndUpdate(id, product, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  async remove(id: string): Promise<Product> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async findByProductName(
    productName: string,
    userId: string,
  ): Promise<Product | null> {
    return this.productModel
      .findOne({ productName }, { createdBy: userId })
      .exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
    isSuperAdmin?: boolean,
  ): Promise<Product[]> {
    if (isSuperAdmin) {
      return this.productModel.find().skip(skip).limit(limit).exec();
    } else {
      return this.productModel
        .find({ createdBy: userId })
        .skip(skip)
        .limit(limit)
        .exec();
    }
  }

  async countAll(userId: string, isSuperAdmin?: boolean): Promise<number> {
    if (isSuperAdmin) {
      return this.productModel.countDocuments().exec();
    } else {
      return this.productModel.countDocuments({ createdBy: userId }).exec();
    }
  }
}
