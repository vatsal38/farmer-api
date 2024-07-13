import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpenseMaster, ExpenseMasterDocument } from './expense-master.schema';

export class ExpenseMasterRepository {
  constructor(
    @InjectModel(ExpenseMaster.name)
    private expenseMasterModel: Model<ExpenseMasterDocument>,
  ) {}

  async create(
    expenseMaster: ExpenseMaster,
    userId: string,
  ): Promise<ExpenseMaster> {
    expenseMaster.createdBy = userId;
    const newExpenseMaster = new this.expenseMasterModel(expenseMaster);
    return newExpenseMaster.save();
  }

  async findAll(userId: string): Promise<ExpenseMaster[]> {
    return this.expenseMasterModel.find({ createdBy: userId }).exec();
  }

  async findOne(id: string): Promise<ExpenseMaster> {
    return this.expenseMasterModel.findById(id).exec();
  }

  async update(
    id: string,
    expenseMaster: Partial<ExpenseMaster>,
  ): Promise<ExpenseMaster> {
    return this.expenseMasterModel
      .findByIdAndUpdate(id, expenseMaster, { new: true })
      .exec();
  }

  async remove(id: string): Promise<ExpenseMaster> {
    return this.expenseMasterModel.findByIdAndDelete(id).exec();
  }

  async findByPhone(
    phone: string,
    userId: string,
  ): Promise<ExpenseMaster | null> {
    return this.expenseMasterModel
      .findOne({ phone }, { createdBy: userId })
      .exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
  ): Promise<ExpenseMaster[]> {
    return this.expenseMasterModel
      .find({ createdBy: userId })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async countAll(userId: string): Promise<number> {
    return this.expenseMasterModel.countDocuments({ createdBy: userId }).exec();
  }
}
