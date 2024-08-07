import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ExpenseMasterRepository } from './expense-master.repository';
import { ExpenseMaster } from './expense-master.schema';
import { generateUniqueUsername } from '../utils/functions';
@Injectable()
export class ExpenseMasterService {
  constructor(
    private readonly expenseMasterRepository: ExpenseMasterRepository,
  ) {}

  async create(
    expenseMaster: ExpenseMaster,
    userId: string,
  ): Promise<ExpenseMaster> {
    try {
      // const existingExpenseMasterByPhone =
      //   await this.expenseMasterRepository.findByPhone(
      //     expenseMaster.phone,
      //     userId,
      //   );

      // if (existingExpenseMasterByPhone) {
      //   throw new ConflictException('ExpenseMaster is already exists');
      // }
      const codePrefix = 'EXP';
      const highestCodeExpenseMaster =
        await this.expenseMasterRepository.highestCodeExpenseMaster(codePrefix);
      let currentCode = 1;
      if (highestCodeExpenseMaster) {
        const highestCode = highestCodeExpenseMaster.code.replace(
          codePrefix,
          '',
        );
        currentCode = parseInt(highestCode, 10) + 1;
      }
      expenseMaster.code = `${codePrefix}${currentCode.toString().padStart(3, '0')}`;
      expenseMaster.username = generateUniqueUsername();
      return await this.expenseMasterRepository.create(expenseMaster, userId);
    } catch (error) {
      if (error.keyPattern && error.keyPattern.phone) {
        throw new ConflictException('Phone number already exists');
      }
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
    search?: string,
    isSuperAdmin?: boolean,
  ) {
    if (page && limit) {
      const skip = (page - 1) * limit;
      const [items, totalRecords] = await Promise.all([
        this.expenseMasterRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.expenseMasterRepository.countAll(userId, search, isSuperAdmin),
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
        search,
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
      // const existingExpenseMasterByPhone =
      //   await this.expenseMasterRepository.findByPhone(
      //     expenseMaster.phone,
      //     userId,
      //   );

      // if (existingExpenseMasterByPhone) {
      //   throw new ConflictException('ExpenseMaster is already exists');
      // }

      const expenseMasterExist = await this.expenseMasterRepository.findOne(id);
      if (!expenseMasterExist) {
        throw new NotFoundException('Expense master not found');
      }

      return await this.expenseMasterRepository.update(id, expenseMaster);
    } catch (error) {
      if (error.keyPattern && error.keyPattern.phone) {
        throw new ConflictException('Phone number already exists');
      }
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

  async updateStatus(
    updateStatusDto: any,
    userId: string,
  ): Promise<ExpenseMaster> {
    const updatedExpenseMaster =
      await this.expenseMasterRepository.updateStatus(
        updateStatusDto.id,
        updateStatusDto.status,
        userId,
      );
    if (!updatedExpenseMaster) {
      throw new NotFoundException('ExpanseMaster not found');
    }
    return updatedExpenseMaster;
  }
}
