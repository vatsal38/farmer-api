import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { Customer } from './customer.schema';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async create(customer: Customer, userId: string): Promise<Customer> {
    try {
      // const existingCustomerByPhone = await this.customerRepository.findByPhone(
      //   customer.phone,
      //   userId,
      // );
      // const existingCustomerByEmail = await this.customerRepository.findByEmail(
      //   customer.email,
      //   userId,
      // );
      // if (existingCustomerByPhone || existingCustomerByEmail) {
      //   throw new ConflictException('Customer is already exists');
      // }

      customer.code = this.generateCode();
      return await this.customerRepository.create(customer, userId);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create customer');
      }
    }
  }

  async findAll(
    userId: string,
    page?: number,
    limit?: number,
    isSuperAdmin?: boolean,
  ) {
    if (page && limit) {
      const skip = (page - 1) * limit;
      const [items, totalRecords] = await Promise.all([
        this.customerRepository.findWithPagination(
          skip,
          limit,
          userId,
          isSuperAdmin,
        ),
        this.customerRepository.countAll(userId, isSuperAdmin),
      ]);
      const totalPages = Math.ceil(totalRecords / limit);
      return {
        items,
        recordsPerPage: limit,
        totalRecords,
        currentPageNumber: page,
        totalPages,
      };
    } else {
      const items = await this.customerRepository.findAll(userId, isSuperAdmin);
      return items;
    }
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async update(
    id: string,
    customer: Partial<Customer>,
    userId: string,
  ): Promise<Customer> {
    try {
      // const existingCustomerByPhone = await this.customerRepository.findByPhone(
      //   customer.phone,
      //   userId,
      // );
      // const existingCustomerByEmail = await this.customerRepository.findByEmail(
      //   customer.email,
      //   userId,
      // );

      // if (existingCustomerByPhone || existingCustomerByEmail) {
      //   throw new ConflictException('Customer is already exists');
      // }

      const existingCustomer = await this.customerRepository.findOne(id);

      if (!existingCustomer) {
        throw new NotFoundException('Customer not found');
      }

      return await this.customerRepository.update(id, customer);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to update customer');
      }
    }
  }

  async remove(id: string): Promise<Customer> {
    try {
      const deletedCustomer = await this.customerRepository.remove(id);
      if (!deletedCustomer) {
        throw new NotFoundException('Customer not found');
      }
      return deletedCustomer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete Customer',
          error.message,
        );
      }
    }
  }
}
