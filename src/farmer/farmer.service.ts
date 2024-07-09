import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FarmerRepository } from './farmer.repository';
import { Farmer } from './farmer.schema';

@Injectable()
export class FarmerService {
  constructor(private readonly farmerRepository: FarmerRepository) {}

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async create(farmer: Farmer): Promise<Farmer> {
    try {
      const existingFarmerByPhone = await this.farmerRepository.findByPhone(
        farmer.phone,
      );
      const existingFarmerByEmail = await this.farmerRepository.findByEmail(
        farmer.email,
      );
      if (existingFarmerByPhone || existingFarmerByEmail) {
        throw new ConflictException('Farmer is already exists');
      }

      farmer.code = this.generateCode();
      return await this.farmerRepository.create(farmer);
    } catch (error) {
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

  async findAll(page?: number, limit?: number) {
    if (page && limit) {
      const skip = (page - 1) * limit;
      const [items, totalRecords] = await Promise.all([
        this.farmerRepository.findWithPagination(skip, limit),
        this.farmerRepository.countAll(),
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
      const items = await this.farmerRepository.findAll();
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

  async update(id: string, farmer: Partial<Farmer>): Promise<Farmer> {
    try {
      const existingFarmerByPhone = await this.farmerRepository.findByPhone(
        farmer.phone,
      );
      const existingFarmerByEmail = await this.farmerRepository.findByEmail(
        farmer.email,
      );

      const existFarmer = await this.farmerRepository.findOne(id);
      if (!existFarmer) {
        throw new NotFoundException('Farmer not found');
      }

      if (existingFarmerByPhone || existingFarmerByEmail) {
        throw new ConflictException('Farmer is already exists');
      }
      return await this.farmerRepository.update(id, farmer);
    } catch (error) {
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
}
