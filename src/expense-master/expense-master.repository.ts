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

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<ExpenseMaster[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.expenseMasterModel.find(query).exec();
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
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<ExpenseMaster[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.expenseMasterModel.find(query).skip(skip).limit(limit).exec();
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
    return this.expenseMasterModel.countDocuments(query).exec();
  }

  async highestCodeExpenseMaster(codePrefix: any) {
    return this.expenseMasterModel
      .findOne({ code: { $regex: `^${codePrefix}` } })
      .sort({ code: -1 })
      .select('code')
      .exec();
  }

  private createSearchQuery(search: string): any {
    if (!search) {
      return {};
    }
    const fieldsToSearch = ['name', 'code', 'phone', 'remarks', 'unique_id'];
    return {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };
  }
}
