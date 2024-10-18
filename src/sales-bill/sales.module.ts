import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sales, SalesSchema } from './sales.schema';
import { SalesRepository } from './sales.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sales.name, schema: SalesSchema }]),
  ],
  controllers: [SalesController],
  providers: [SalesService, SalesRepository],
})
export class SalesModule {}
