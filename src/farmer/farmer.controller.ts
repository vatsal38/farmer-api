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
import { FarmerService } from './farmer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Farmer } from './farmer.schema';
import { UpdateFarmerDto } from './update-farmer.dto';

@Controller('farmers')
export class FarmerController {
  constructor(private readonly farmerService: FarmerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() farmer: Farmer) {
    const userId = req.user.userId;
    await this.farmerService.create(farmer, userId);
    return { message: 'Farmer created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const userId = req.user.userId;
    return this.farmerService.findAll(userId, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.farmerService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateFarmerDto: UpdateFarmerDto,
  ) {
    const userId = req.user.userId;
    await this.farmerService.update(id, updateFarmerDto, userId);
    return { message: 'Farmer updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.farmerService.remove(id);
    return { message: 'Farmer deleted successfully!' };
  }
}
