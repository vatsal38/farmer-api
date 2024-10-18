import { GlobalMasterModule } from './../global-master/global-master.module';
import { GlobalMasterService } from './../global-master/global-master.service';
import { GlobalMasterRepository } from './../global-master/global-master.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sales, SalesSchema } from './sales.schema';
import { SalesRepository } from './sales.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sales.name, schema: SalesSchema }]),
    GlobalMasterModule,
  ],
  controllers: [SalesController],
  providers: [
    SalesService,
    SalesRepository,
    GlobalMasterService,
    GlobalMasterRepository,
  ],
})
export class SalesModule {}
