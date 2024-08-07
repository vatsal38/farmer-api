import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FarmerRepository } from './farmer.repository';
import { Farmer } from './farmer.schema';
import { generateUniqueUsername } from '../utils/functions';
@Injectable()
export class FarmerService {
  constructor(private readonly farmerRepository: FarmerRepository) {}

  async create(farmer: Farmer, userId: string): Promise<Farmer> {
    try {
      const codePrefix = 'FAR';
      const highestCodeFarmer =
        await this.farmerRepository.highestCodeFarmer(codePrefix);
      let currentCode = 1;
      if (highestCodeFarmer) {
        const highestCode = highestCodeFarmer.code.replace(codePrefix, '');
        currentCode = parseInt(highestCode, 10) + 1;
      }
      farmer.code = `${codePrefix}${currentCode.toString().padStart(3, '0')}`;
      farmer.username = generateUniqueUsername();
      return await this.farmerRepository.create(farmer, userId);
    } catch (error) {
      if (error.keyPattern && error.keyPattern.phone) {
        throw new ConflictException('Phone number already exists');
      }
      if (error.keyPattern && error.keyPattern.email) {
        throw new ConflictException('Email already exists');
      }
      if (error.keyPattern && error.keyPattern.username) {
        throw new ConflictException('Username already exists');
      }
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create farmer');
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
        this.farmerRepository.findWithPagination(
          skip,
          limit,
          userId,
          search,
          isSuperAdmin,
        ),
        this.farmerRepository.countAll(userId, search, isSuperAdmin),
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
      const items = await this.farmerRepository.findAll(
        userId,
        search,
        isSuperAdmin,
      );
      return items;
    }
  }

  async findOne(id: string): Promise<Farmer> {
    const farmer = await this.farmerRepository.findOne(id);
    if (!farmer) {
      throw new NotFoundException('Farmer not found');
    }
    return farmer;
  }

  async update(
    id: string,
    farmer: Partial<Farmer>,
    userId: string,
  ): Promise<Farmer> {
    try {
      // const existingFarmerByPhone = await this.farmerRepository.findByPhone(
      //   farmer.phone,
      //   userId,
      // );
      // const existingFarmerByEmail = await this.farmerRepository.findByEmail(
      //   farmer.email,
      //   userId,
      // );

      // if (existingFarmerByPhone || existingFarmerByEmail) {
      //   throw new ConflictException('Farmer is already exists');
      // }

      const existFarmer = await this.farmerRepository.findOne(id);
      if (!existFarmer) {
        throw new NotFoundException('Farmer not found');
      }

      return await this.farmerRepository.update(id, farmer);
    } catch (error) {
      if (error.keyPattern && error.keyPattern.phone) {
        throw new ConflictException('Phone number already exists');
      }
      if (error.keyPattern && error.keyPattern.email) {
        throw new ConflictException('Email already exists');
      }
      if (error.keyPattern && error.keyPattern.username) {
        throw new ConflictException('Username already exists');
      }
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to update farmer');
      }
    }
  }

  async remove(id: string): Promise<Farmer> {
    try {
      const deletedFarmer = await this.farmerRepository.remove(id);
      if (!deletedFarmer) {
        throw new NotFoundException('Farmer not found');
      }
      return deletedFarmer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete farmer',
          error.message,
        );
      }
    }
  }

  async updateStatus(updateStatusDto: any, userId: string): Promise<Farmer> {
    const updatedFarmer = await this.farmerRepository.updateStatus(
      updateStatusDto.id,
      updateStatusDto.status,
      userId,
    );
    if (!updatedFarmer) {
      throw new NotFoundException('Farmer not found');
    }
    return updatedFarmer;
  }
}
