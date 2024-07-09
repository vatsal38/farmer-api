import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './customer.schema';

export class CustomerRepository {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async create(customer: Customer): Promise<Customer> {
    const newCustomer = new this.customerModel(customer);
    return newCustomer.save();
  }

  async findAll(): Promise<Customer[]> {
    return this.customerModel.find().exec();
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

  async findByPhone(phone: string): Promise<Customer | null> {
    return this.customerModel.findOne({ phone }).exec();
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.customerModel.findOne({ email }).exec();
  }

  async findWithPagination(skip: number, limit: number): Promise<Customer[]> {
    return this.customerModel.find().skip(skip).limit(limit).exec();
  }

  async countAll(): Promise<number> {
    return this.customerModel.countDocuments().exec();
  }
}
