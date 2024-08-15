import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BankRepository } from './bank.repository';
import { Bank } from './bank.schema';
import { generateUniqueUsername } from '../utils/functions';
@Injectable()
export class BankService {
  constructor(private readonly bankRepository: BankRepository) {}

  async create(bank: Bank, userId: string): Promise<Bank> {
    try {
      return await this.bankRepository.create(bank, userId);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create bank');
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
        this.bankRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.bankRepository.countAll(userId, search, isSuperAdmin),
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
      const items = await this.bankRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string): Promise<Bank> {
    const bank = await this.bankRepository.findOne(id);
    if (!bank) {
      throw new NotFoundException('Bank not found');
    }
    return bank;
  }

  async update(id: string, bank: Partial<Bank>, userId: string): Promise<Bank> {
    try {
      const existBank = await this.bankRepository.findOne(id);
      if (!existBank) {
        throw new NotFoundException('Bank not found');
      }
      return await this.bankRepository.update(id, bank);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to update bank');
      }
    }
  }

  async remove(id: string): Promise<Bank> {
    try {
      const deletedBank = await this.bankRepository.remove(id);
      if (!deletedBank) {
        throw new NotFoundException('Bank not found');
      }
      return deletedBank;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete bank',
          error.message,
        );
      }
    }
  }
}
