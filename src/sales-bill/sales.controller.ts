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
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Sales } from './sales.schema';
import { UpdateBillDto } from './update-sales.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Sales')
@ApiBearerAuth()
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new sales' })
  @ApiBody({ type: Sales })
  async create(@Req() req: any, @Body() sales: Sales) {
    const userId = req.user.userId;
    const newSales: any = await this.salesService.create(sales, userId);

    return { message: 'Sales created successfully!', id: newSales?._id };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all sales' })
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
    const isWebLogin = req.user.loginType === 'web';
    return this.salesService.findAll(
      userId,
      isWebLogin,
      page,
      limit,
      search,
      isSuperAdmin,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single sales by id' })
  async findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a sales' })
  @ApiBody({ type: UpdateBillDto })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateBillingDto: UpdateBillDto,
  ) {
    const userId = req.user.userId;
    await this.salesService.update(id, updateBillingDto, userId);
    return { message: 'Sales updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a sales' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.salesService.remove(id);
    return { message: 'Sales deleted successfully!' };
  }

  @Patch(':salesId/bills/:billId')
  async updateBill(
    @Param('salesId') salesId: string,
    @Param('billId') billId: string,
    @Body() updateBillingDto: UpdateBillDto,
  ) {
    await this.salesService.updateBillById(salesId, billId, updateBillingDto);
    return { message: 'Billing updated successfully!' };
  }

  @Delete(':salesId/bills/:billId')
  async deleteBill(
    @Param('salesId') salesId: string,
    @Param('billId') billId: string,
  ) {
    await this.salesService.deleteBillById(salesId, billId);
    return { message: 'Billing deleted successfully!' };
  }
}
