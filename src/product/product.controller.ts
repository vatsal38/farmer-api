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
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly firebaseService: FirebaseService,
  ) {}

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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV file to upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product data',
    schema: {
      type: 'object',
      properties: {
        productName: { type: 'string' },
        type: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  async create(@Req() req: any, @Body() body: any, @UploadedFile() image: any) {
    const userId = req.user.userId;
    if (image) {
      const imageUrl = await this.firebaseService.uploadFile(image);
      body.image = imageUrl;
    }
    await this.productService.create(body, userId);
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update a product',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        productName: { type: 'string' },
        type: { type: 'string' },
      },
    },
  })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() image: any,
  ) {
    const userId = req.user.userId;
    if (image) {
      const imageUrl = await this.firebaseService.uploadFile(image);
      updateProductDto.image = imageUrl;
    }
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
