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
  HttpException,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Product } from './product.schema';
import { UpdateProductDto } from './update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(csv)$/)) {
          return cb(
            new HttpException(
              'Only CSV files are allowed!',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Upload the CSV file' })
  async uploadFile(@Req() req: any, @UploadedFile() file) {
    const userId = req.user.userId;
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }
    return await this.productService.importProductsFromCsv(file.path, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: Product })
  async create(@Req() req: any, @Body() product: Product) {
    const userId = req.user.userId;
    await this.productService.create(product, userId);
    return { message: 'Product created successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const isSuperAdmin = req.user.role === 'superadmin';
    const userId = req.user.userId;
    return this.productService.findAll(userId, page, limit, isSuperAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by id' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.productService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const userId = req.user.userId;
    await this.productService.update(id, updateProductDto, userId);
    return { message: 'Product updated successfully!' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  async remove(@Param('id') id: string) {
    await this.productService.remove(id);
    return {
      message: 'Product deleted Successfully',
    };
  }
}
