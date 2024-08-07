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

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Product[]> {
    const query = this.createSearchQuery(search);

    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.productModel.find(query).exec();
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
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Product[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.productModel.find(query).skip(skip).limit(limit).exec();
  }

  async countAll(
    userId: string,
    search: string,
    isSuperAdmin?: boolean,
  ): Promise<number> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.productModel.countDocuments(query).exec();
  }

  async highestCodeProduct(codePrefix: any) {
    return this.productModel
      .findOne({ code: { $regex: `^${codePrefix}` } })
      .sort({ code: -1 })
      .select('code')
      .exec();
  }

  async updateStatus(
    id: string,
    status: boolean,
    userId: string,
  ): Promise<Product> {
    return this.productModel
      .findByIdAndUpdate(
        id,
        { status, updatedBy: userId, updatedAt: new Date() },
        { new: true },
      )
      .exec();
  }

  private createSearchQuery(search: string): any {
    if (!search) {
      return {};
    }
    const fieldsToSearch = ['productName', 'code', 'type'];
    return {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };
  }
}
