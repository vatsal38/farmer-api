import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sales, SalesDocument } from './sales.schema';

export class SalesRepository {
  constructor(
    @InjectModel(Sales.name) private salesModel: Model<SalesDocument>,
  ) {}

  async create(sales: Sales, userId: string): Promise<Sales> {
    sales.createdBy = userId;
    sales.user = userId;
    if (sales.billList && sales.billList.length > 0) {
      sales.billList.forEach((bill) => {
        bill.user = userId;
      });
    }
    const newSales = new this.salesModel(sales);
    return newSales.save();
  }

  async findAll(
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Sales[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.salesModel.find(query).exec();
  }

  async findOne(id: string): Promise<Sales> {
    return this.salesModel.findById(id).exec();
  }

  async update(id: string, sales: Partial<Sales>): Promise<Sales> {
    return this.salesModel.findByIdAndUpdate(id, sales, { new: true }).exec();
  }

  async remove(id: string): Promise<Sales> {
    return this.salesModel.findByIdAndDelete(id).exec();
  }

  async findByPhone(phone: string, userId: string): Promise<Sales | null> {
    return this.salesModel.findOne({ phone }, { createdBy: userId }).exec();
  }

  async findByEmail(email: string, userId: string): Promise<Sales | null> {
    return this.salesModel.findOne({ email }, { createdBy: userId }).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
    search?: string,
    isSuperAdmin?: boolean,
  ): Promise<Sales[]> {
    const query = this.createSearchQuery(search);
    if (!isSuperAdmin) {
      query.createdBy = userId;
    }
    return this.salesModel.find(query).skip(skip).limit(limit).exec();
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
    return this.salesModel.countDocuments(query).exec();
  }

  async highestCodeSales(codePrefix: any) {
    return this.salesModel
      .findOne({ code: { $regex: `^${codePrefix}` } })
      .sort({ code: -1 })
      .select('code')
      .exec();
  }

  async updateStatus(
    id: string,
    status: boolean,
    userId: string,
  ): Promise<Sales> {
    return this.salesModel
      .findByIdAndUpdate(
        id,
        { status, updatedBy: userId, updatedAt: new Date() },
        { new: true },
      )
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
