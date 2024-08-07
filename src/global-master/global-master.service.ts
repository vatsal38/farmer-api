import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GlobalMaster } from './global-master.schema';
import { GlobalMasterRepository } from './global-master.repository';

@Injectable()
export class GlobalMasterService {
  constructor(
    private readonly globalMasterRepository: GlobalMasterRepository,
  ) {}

  async create(
    globalMaster: GlobalMaster,
    userId: string,
  ): Promise<GlobalMaster> {
    try {
      const codePrefix = 'GM';
      const highestCodeGlobalMaster =
        await this.globalMasterRepository.highestCodeGlobalMaster(codePrefix);
      let currentCode = 1;
      if (highestCodeGlobalMaster) {
        const highestCode = highestCodeGlobalMaster.code.replace(
          codePrefix,
          '',
        );
        currentCode = parseInt(highestCode, 10) + 1;
      }
      globalMaster.code = `${codePrefix}${currentCode.toString().padStart(3, '0')}`;
      return await this.globalMasterRepository.create(globalMaster, userId);
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
        throw new InternalServerErrorException(
          'Failed to create Global Master',
        );
      }
    }
  }

  async findOne(id: string): Promise<GlobalMaster> {
    const globalMaster = await this.globalMasterRepository.findOne(id);
    if (!globalMaster) {
      throw new NotFoundException('Global Master not found');
    }
    return globalMaster;
  }

  async update(
    id: string,
    globalMaster: Partial<GlobalMaster>,
  ): Promise<GlobalMaster> {
    try {
      const existGlobalMaster = await this.globalMasterRepository.findOne(id);
      if (!existGlobalMaster) {
        throw new NotFoundException('GlobalMaster not found');
      }

      return await this.globalMasterRepository.update(id, globalMaster);
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
        throw new InternalServerErrorException('Failed to update GlobalMaster');
      }
    }
  }
}
