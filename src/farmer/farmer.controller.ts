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
import { FarmerService } from './farmer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Farmer } from './farmer.schema';
import { UpdateFarmerDto } from './update-farmer.dto';

@Controller('farmers')
export class FarmerController {
  constructor(private readonly farmerService: FarmerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() farmer: Farmer) {
    return this.farmerService.create(farmer);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.farmerService.findAll(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.farmerService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFarmerDto: UpdateFarmerDto,
  ) {
    return this.farmerService.update(id, updateFarmerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.farmerService.remove(id);
  }
}
