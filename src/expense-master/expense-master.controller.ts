import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ExpenseMasterService } from './expense-master.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Ensure you have the JwtAuthGuard implemented
import { ExpenseMaster } from './expense-master.schema';
import { UpdateExpenseMasterDto } from './update-expense-master.dto';

@Controller('expense-masters')
export class ExpenseMasterController {
  constructor(private readonly expenseMasterService: ExpenseMasterService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() expenseMaster: ExpenseMaster) {
    return this.expenseMasterService.create(expenseMaster);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.expenseMasterService.findAll(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.expenseMasterService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExpenseMasterDto: UpdateExpenseMasterDto,
  ) {
    return this.expenseMasterService.update(id, updateExpenseMasterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.expenseMasterService.remove(id);
  }
}
