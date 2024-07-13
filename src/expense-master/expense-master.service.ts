import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ExpenseMasterRepository } from './expense-master.repository';
import { ExpenseMaster } from './expense-master.schema';

@Injectable()
export class ExpenseMasterService {
  constructor(
    private readonly expenseMasterRepository: ExpenseMasterRepository,
  ) {}

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async create(
    expenseMaster: ExpenseMaster,
    userId: string,
  ): Promise<ExpenseMaster> {
    try {
      const existingExpenseMasterByPhone =
        await this.expenseMasterRepository.findByPhone(
          expenseMaster.phone,
          userId,
        );

      if (existingExpenseMasterByPhone) {
        throw new ConflictException('ExpenseMaster is already exists');
      }
      expenseMaster.code = this.generateCode();
      return await this.expenseMasterRepository.create(expenseMaster, userId);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to create expense master',
        );
      }
    }
  }

  async findAll(
    userId: string,
    page?: number,
    limit?: number,
    isSuperAdmin?: boolean,
  ) {
    if (page && limit) {
      const skip = (page - 1) * limit;
      const [items, totalRecords] = await Promise.all([
        this.expenseMasterRepository.findWithPagination(
          skip,
          limit,
          userId,
          isSuperAdmin,
        ),
        this.expenseMasterRepository.countAll(userId, isSuperAdmin),
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
      const items = await this.expenseMasterRepository.findAll(
        userId,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string): Promise<ExpenseMaster> {
    const expenseMaster = await this.expenseMasterRepository.findOne(id);
    if (!expenseMaster) {
      throw new NotFoundException('Expense master not found');
    }
    return expenseMaster;
  }

  async update(
    id: string,
    expenseMaster: Partial<ExpenseMaster>,
    userId: string,
  ): Promise<ExpenseMaster> {
    try {
      const existingExpenseMasterByPhone =
        await this.expenseMasterRepository.findByPhone(
          expenseMaster.phone,
          userId,
        );

      if (existingExpenseMasterByPhone) {
        throw new ConflictException('ExpenseMaster is already exists');
      }

      const expenseMasterExist = await this.expenseMasterRepository.findOne(id);
      if (!expenseMasterExist) {
        throw new NotFoundException('Expense master not found');
      }

      return await this.expenseMasterRepository.update(id, expenseMaster);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to update expense master',
        );
      }
    }
  }

  async remove(id: string): Promise<ExpenseMaster> {
    try {
      const deletedExpanseMaster =
        await this.expenseMasterRepository.remove(id);
      if (!deletedExpanseMaster) {
        throw new NotFoundException('ExpanseMaster not found');
      }
      return deletedExpanseMaster;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete expense master',
          error.message,
        );
      }
    }
  }
}
