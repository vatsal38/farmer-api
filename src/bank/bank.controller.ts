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
import { BankService } from './bank.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Bank } from './bank.schema';
import { UpdateBankDto } from './update-bank.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Banks')
@ApiBearerAuth()
@Controller('banks')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new bank' })
  @ApiBody({ type: Bank })
  async create(@Req() req: any, @Body() bank: Bank) {
    const userId = req.user.userId;
    await this.bankService.create(bank, userId);
    return { message: 'Bank created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all banks' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    const isSuperAdmin = req.user.role === 'superadmin';
    const userId = req.user.userId;
    return this.bankService.findAll(userId, page, limit, search, isSuperAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single bank by id' })
  async findOne(@Param('id') id: string) {
    return this.bankService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a bank' })
  @ApiBody({ type: UpdateBankDto })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateBankDto: UpdateBankDto,
  ) {
    const userId = req.user.userId;
    await this.bankService.update(id, updateBankDto, userId);
    return { message: 'Bank updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a bank' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.bankService.remove(id);
    return { message: 'Bank deleted successfully!' };
  }
}
