import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product } from './product.schema';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async create(product: Product): Promise<Product> {
    try {
      const existingProduct = await this.productRepository.findByProductName(
        product.productName,
      );
      if (existingProduct) {
        throw new ConflictException('Product with this name already exists');
      }
      product.code = this.generateCode();
      return await this.productRepository.create(product);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create product');
      }
    }
  }

  async findAll(page?: number, limit?: number) {
    if (page && limit) {
      const skip = (page - 1) * limit;
      const [items, totalRecords] = await Promise.all([
        this.productRepository.findWithPagination(skip, limit),
        this.productRepository.countAll(),
      ]);
      const totalPages = Math.ceil(totalRecords / limit);
      return {
        items,
        recordsPerPage: limit,
        totalRecords,
        currentPageNumber: page,
        totalPages,
      };
    } else {
      const items = await this.productRepository.findAll();
      return items;
    }
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    try {
      const existingProduct = await this.productRepository.findByProductName(
        product.productName,
      );
      if (existingProduct) {
        throw new ConflictException('Product with this name already exists');
      }

      const existProduct = await this.productRepository.findOne(id);
      if (!existProduct) {
        throw new NotFoundException('Product not found');
      }

      return await this.productRepository.update(id, product);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to update product');
      }
    }
  }

  async remove(id: string): Promise<Product> {
    try {
      const deletedProduct = await this.productRepository.remove(id);
      if (!deletedProduct) {
        throw new NotFoundException('Product not found');
      }
      return deletedProduct;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete product',
          error.message,
        );
      }
    }
  }
}
