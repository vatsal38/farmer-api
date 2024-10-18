import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SalesRepository } from './sales.repository';
import { Sales } from './sales.schema';
import { generateUniqueUsername } from '../utils/functions';
@Injectable()
export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}

  async create(sales: Sales, userId: string): Promise<Sales> {
    try {
      return await this.salesRepository.create(sales, userId);
    } catch (error) {
      console.log('error::: ', error);
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create sales');
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
        this.salesRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.salesRepository.countAll(userId, search, isSuperAdmin),
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
      const items = await this.salesRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string): Promise<Sales> {
    const sales = await this.salesRepository.findOne(id);
    if (!sales) {
      throw new NotFoundException('Sales not found');
    }
    return sales;
  }

  async update(id: string, sales: any, userId: string): Promise<Sales> {
    try {
      const existSales = await this.salesRepository.findOne(id);
      if (!existSales) {
        throw new NotFoundException('Sales not found');
      }
      return await this.salesRepository.update(id, sales);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to update sales');
      }
    }
  }

  async remove(id: string): Promise<Sales> {
    try {
      const deletedSales = await this.salesRepository.remove(id);
      if (!deletedSales) {
        throw new NotFoundException('Sales not found');
      }
      return deletedSales;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete sales',
          error.message,
        );
      }
    }
  }

  async updateStatus(updateStatusDto: any, userId: string): Promise<Sales> {
    const updatedSales = await this.salesRepository.updateStatus(
      updateStatusDto.id,
      updateStatusDto.status,
      userId,
    );
    if (!updatedSales) {
      throw new NotFoundException('Sales not found');
    }
    return updatedSales;
  }
}
