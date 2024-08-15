import { LocalAuthGuard } from './../../auth/local-auth.guard';
import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Patch,
  Param,
  Req,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AccessManagerDto } from '../dto/access-manager.dto';
import { UserService } from '../user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Access Manager')
@ApiBearerAuth()
@Controller('access-manager')
export class AccessManagerController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new Access Manager' })
  @ApiBody({ type: AccessManagerDto })
  async createAccessManager(
    @Body() createAccessManagerDto: AccessManagerDto,
    @Request() req: any,
  ) {
    const createdBy = req.user.userId;
    const data = await this.userService.createAccessManager(
      createAccessManagerDto,
      createdBy,
    );
    return {
      message: 'Access Manager created successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'update Access Manager' })
  async updateAccessManager(
    @Param('id') id: string,
    @Body() user: AccessManagerDto,
    @Req() req: any,
  ) {
    console.log(req.user);
    const userId = req.user.userId;
    await this.userService.updateAccessManager(id, user, userId);
    return {
      message: 'Access Manager updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'list Access Manager' })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(@Req() req: any, @Query('search') search?: string) {
    const isSuperAdmin = req.user.role === 'superadmin';
    const userId = req.user.userId;
    return this.userService.findAllAccessManagers(userId, isSuperAdmin, search);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Access manager' })
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
    return {
      message: 'User deleted Successfully',
    };
  }
}
