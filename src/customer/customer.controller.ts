import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Customer } from './customer.schema';
import { UpdateCustomerDto } from './update-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() customer: Customer) {
    const userId = req.user.userId;
    await this.customerService.create(customer, userId);
    return { message: 'Customer created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const userId = req.user.userId;
    return this.customerService.findAll(userId, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const userId = req.user.userId;
    await this.customerService.update(id, updateCustomerDto, userId);
    return { message: 'Customer updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.customerService.remove(id);
    return { message: 'Customer deleted successfully!' };
  }
}
