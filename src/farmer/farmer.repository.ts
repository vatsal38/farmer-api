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

  async findAll(userId: string): Promise<Farmer[]> {
    return this.farmerModel.find({ createdBy: userId }).exec();
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
  ): Promise<Farmer[]> {
    return this.farmerModel.find().skip(skip).limit(limit).exec();
  }

  async countAll(userId: string): Promise<number> {
    return this.farmerModel.countDocuments({ createdBy: userId }).exec();
  }
}
