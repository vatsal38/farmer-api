import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Farmer, FarmerDocument } from './farmer.schema';

export class FarmerRepository {
  constructor(
    @InjectModel(Farmer.name) private farmerModel: Model<FarmerDocument>,
  ) {}

  async create(farmer: Farmer): Promise<Farmer> {
    const newFarmer = new this.farmerModel(farmer);
    return newFarmer.save();
  }

  async findAll(): Promise<Farmer[]> {
    return this.farmerModel.find().exec();
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

  async findByPhone(phone: string): Promise<Farmer | null> {
    return this.farmerModel.findOne({ phone }).exec();
  }

  async findByEmail(email: string): Promise<Farmer | null> {
    return this.farmerModel.findOne({ email }).exec();
  }

  async findWithPagination(skip: number, limit: number): Promise<Farmer[]> {
    return this.farmerModel.find().skip(skip).limit(limit).exec();
  }

  async countAll(): Promise<number> {
    return this.farmerModel.countDocuments().exec();
  }
}
