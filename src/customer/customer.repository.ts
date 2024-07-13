import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './customer.schema';

export class CustomerRepository {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async create(customer: Customer, userId: string): Promise<Customer> {
    customer.createdBy = userId;
    const newCustomer = new this.customerModel(customer);
    return newCustomer.save();
  }

  async findAll(userId: string): Promise<Customer[]> {
    return this.customerModel.find({ createdBy: userId }).exec();
  }

  async findOne(id: string): Promise<Customer> {
    return this.customerModel.findById(id).exec();
  }

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    return this.customerModel
      .findByIdAndUpdate(id, customer, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Customer> {
    return this.customerModel.findByIdAndDelete(id).exec();
  }

  async findByPhone(phone: string, userId: string): Promise<Customer | null> {
    return this.customerModel.findOne({ phone }, { createdBy: userId }).exec();
  }

  async findByEmail(email: string, userId: string): Promise<Customer | null> {
    return this.customerModel.findOne({ email }, { createdBy: userId }).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    userId: string,
  ): Promise<Customer[]> {
    return this.customerModel
      .find({ createdBy: userId })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async countAll(userId: string): Promise<number> {
    return this.customerModel.countDocuments({ createdBy: userId }).exec();
  }
}
