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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GlobalMaster } from './global-master.schema';
import { GlobalMasterDto } from './update-global-master.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GlobalMasterService } from './global-master.service';
@ApiTags('Global Master')
@ApiBearerAuth()
@Controller('global-master')
export class GlobalMasterController {
  constructor(private readonly globalMasterService: GlobalMasterService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a Global Master' })
  @ApiBody({ type: GlobalMaster })
  async create(@Req() req: any, @Body() globalMaster: GlobalMaster) {
    const userId = req.user.userId;
    await this.globalMasterService.create(globalMaster, userId);
    return { message: 'GlobalMaster created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOperation({ summary: 'Get a Global Master by id' })
  async findOne(@Req() req: any) {
    const userId = req.user.userId;
    return this.globalMasterService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('')
  @ApiOperation({ summary: 'Update a Global Master' })
  @ApiBody({ type: GlobalMasterDto })
  async update(@Req() req: any, @Body() globalMasterDto: GlobalMasterDto) {
    const userId = req.user.userId;
    await this.globalMasterService.update(userId, globalMasterDto);
    return { message: 'Global Master updated successfully!' };
  }
}
