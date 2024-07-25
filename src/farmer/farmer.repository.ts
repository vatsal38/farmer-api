import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Farmer, FarmerDocument } from './farmer.schema';

export class FarmerRepository {
  constructor(
    @InjectModel(Farmer.name) private farmerModel: Model<FarmerDocument>,
  ) {}

  async create(farmer: Farmer, userId: string): Promise<Farmer> {
    farmer.createdBy = userId;
    const newFarmer = new this.farmerModel(farmer);
    return newFarmer.save();
  }

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Farmer[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.farmerModel.find(query).exec();
  }

  async findOne(id: string): Promise<Farmer> {
    return this.farmerModel.findById(id).exec();
  }

  async update(id: string, farmer: Partial<Farmer>): Promise<Farmer> {
    return this.farmerModel.findByIdAndUpdate(id, farmer, { new: true }).exec();
  }

  async remove(id: string): Promise<Farmer> {
    return this.farmerModel.findByIdAndDelete(id).exec();
  }

  async findByPhone(phone: string, userId: string): Promise<Farmer | null> {
    return this.farmerModel.findOne({ phone }, { createdBy: userId }).exec();
  }

  async findByEmail(email: string, userId: string): Promise<Farmer | null> {
    return this.farmerModel.findOne({ email }, { createdBy: userId }).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Farmer[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.farmerModel.find(query).skip(skip).limit(limit).exec();
  }

  async countAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<number> {
    const query = this.createSearchQuery(search);

    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.farmerModel.countDocuments(query).exec();
  }

  async highestCodeFarmer(codePrefix: any) {
    return this.farmerModel
      .findOne({ code: { $regex: `^${codePrefix}` } })
      .sort({ code: -1 })
      .select('code')
      .exec();
  }

  private createSearchQuery(search: string): any {
    if (!search) {
      return {};
    }
    const fieldsToSearch = [
      'code',
      'name',
      'email',
      'phone',
      'village',
      'username',
      'gender',
    ];
    return {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };
  }
}
