import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product } from './product.schema';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import { generateRandomCode } from '../utils/functions';
@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}
  async importProductsFromCsv(filePath: string, userId: string): Promise<any> {
    const codePrefix = 'VEG';
    const products = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(
          csvParser({
            separator: ';',
            headers: ['productName', 'code', 'type', 'image'],
          }),
        )
        .on('data', (row) => {
          products.push(row);
        })
        .on('end', async () => {
          try {
            for (const product of products) {
              const highestCodeProduct =
                await this.productRepository.highestCodeProduct(codePrefix);
              let currentCode = 1;
              if (highestCodeProduct) {
                const highestCode = highestCodeProduct.code.replace(
                  codePrefix,
                  '',
                );
                currentCode = parseInt(highestCode, 10) + 1;
              }
              if (!product.productName || !product.type || !product.image) {
                throw new BadRequestException('Missing required fields');
              }
              await this.productRepository.create(
                {
                  productName: product.productName,
                  code: `${codePrefix}${currentCode.toString().padStart(3, '0')}`,
                  type: product.type,
                  image: product.image,
                  status: true,
                  user: null,
                  createdBy: null,
                  createdAt: new Date(),
                  updatedBy: null,
                  updatedAt: new Date(),
                },
                userId,
              );
            }
            resolve({ message: 'Products imported successfully' });
          } catch (error) {
            reject(
              new InternalServerErrorException(
                'Failed to import products',
                error.message,
              ),
            );
          } finally {
            fs.unlinkSync(filePath);
          }
        });
    });
  }

  async create(product: Product, userId: string): Promise<Product> {
    try {
      // const existingProduct = await this.productRepository.findByProductName(
      //   product.productName,
      //   userId,
      // );
      // if (existingProduct) {
      //   throw new ConflictException('Product with this name already exists');
      // }
      const codePrefix = 'VEG';
      const highestCodeProduct =
        await this.productRepository.highestCodeProduct(codePrefix);
      let currentCode = 1;
      if (highestCodeProduct) {
        const highestCode = highestCodeProduct.code.replace(codePrefix, '');
        currentCode = parseInt(highestCode, 10) + 1;
      }
      product.code = `${codePrefix}${currentCode.toString().padStart(3, '0')}`;
      return await this.productRepository.create(product, userId);
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

  async findAll(
    userId: string,
    page?: number,
    limit?: number,
    search?: string,
    isSuperAdmin?: boolean,
  ) {
    if (page && limit) {
      const skip = (page - 1) * limit;
      const [items, totalRecords] = await Promise.all([
        this.productRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.productRepository.countAll(userId, search, isSuperAdmin),
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
      const items = await this.productRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string, userId: string): Promise<Product> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: string,
    product: Partial<Product>,
    userId: string,
  ): Promise<Product> {
    try {
      // const existingProduct = await this.productRepository.findByProductName(
      //   product.productName,
      //   userId,
      // );
      // if (existingProduct) {
      //   throw new ConflictException('Product with this name already exists');
      // }

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
