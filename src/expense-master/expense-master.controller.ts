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
import { ExpenseMasterService } from './expense-master.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExpenseMaster } from './expense-master.schema';
import { UpdateExpenseMasterDto } from './update-expense-master.dto';

@Controller('expense-masters')
export class ExpenseMasterController {
  constructor(private readonly expenseMasterService: ExpenseMasterService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() expenseMaster: ExpenseMaster) {
    const userId = req.user.userId;
    await this.expenseMasterService.create(expenseMaster, userId);
    return { message: 'Expense Master created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const isSuperAdmin = req.user.role === 'superadmin';
    const userId = req.user.userId;
    return this.expenseMasterService.findAll(userId, page, limit, isSuperAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.expenseMasterService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateExpenseMasterDto: UpdateExpenseMasterDto,
  ) {
    const userId = req.user.userId;
    await this.expenseMasterService.update(id, updateExpenseMasterDto, userId);
    return { message: 'Expense Master updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.expenseMasterService.remove(id);
    return { message: 'Expense Master deleted successfully!' };
  }
}
