import { FirebaseService } from './../common/firebase.service';
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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FarmerService } from './farmer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Farmer } from './farmer.schema';
import { UpdateFarmerDto } from './update-farmer.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
@ApiTags('Farmers')
@ApiBearerAuth()
@Controller('farmers')
export class FarmerController {
  constructor(
    private readonly farmerService: FarmerService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new farmer' })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product data',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        village: { type: 'string' },
        gender: { type: 'string' },
        status: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  async create(
    @Req() req: any,
    @Body() farmer: Farmer,
    @UploadedFile() image: any,
  ) {
    const userId = req.user.userId;
    if (image) {
      const imageUrl = await this.firebaseService.uploadFile(image);
      farmer.image = imageUrl;
    }
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
