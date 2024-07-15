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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Farmers')
@ApiBearerAuth()
@Controller('farmers')
export class FarmerController {
  constructor(private readonly farmerService: FarmerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new farmer' })
  @ApiBody({ type: Farmer })
  async create(@Req() req: any, @Body() farmer: Farmer) {
    const userId = req.user.userId;
    await this.farmerService.create(farmer, userId);
    return { message: 'Farmer created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all farmers' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const isSuperAdmin = req.user.role === 'superadmin';
    const userId = req.user.userId;
    return this.farmerService.findAll(userId, page, limit, isSuperAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single farmer by id' })
  async findOne(@Param('id') id: string) {
    return this.farmerService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a farmer' })
  @ApiBody({ type: UpdateFarmerDto })
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
  @ApiOperation({ summary: 'Delete a farmer' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.farmerService.remove(id);
    return { message: 'Farmer deleted successfully!' };
  }
}
