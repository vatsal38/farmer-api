import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bank, BankDocument } from './bank.schema';

export class BankRepository {
  constructor(@InjectModel(Bank.name) private bankModel: Model<BankDocument>) {}

  async create(bank: Bank, userId: string): Promise<Bank> {
    bank.createdBy = userId;
    bank.user = userId;
    const newBank = new this.bankModel(bank);
    return newBank.save();
  }

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Bank[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.bankModel.find(query).exec();
  }

  async findOne(id: string): Promise<Bank> {
    return this.bankModel.findById(id).exec();
  }

  async update(id: string, bank: Partial<Bank>): Promise<Bank> {
    return this.bankModel.findByIdAndUpdate(id, bank, { new: true }).exec();
  }

  async remove(id: string): Promise<Bank> {
    return this.bankModel.findByIdAndDelete(id).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Bank[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.bankModel.find(query).skip(skip).limit(limit).exec();
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
    return this.bankModel.countDocuments(query).exec();
  }

  async highestCodeBank(codePrefix: any) {
    return this.bankModel
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
      'address',
      'phone',
      'remarks',
      'openingBalance',
    ];
    return {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };
  }
}
