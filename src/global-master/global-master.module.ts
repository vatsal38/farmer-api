import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalMasterService } from './global-master.service';
import { GlobalMasterController } from './global-master.controller';
import { GlobalMaster, GlobalMasterSchema } from './global-master.schema';
import { GlobalMasterRepository } from './global-master.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GlobalMaster.name, schema: GlobalMasterSchema },
    ]),
  ],
  controllers: [GlobalMasterController],
  providers: [GlobalMasterService, GlobalMasterRepository],
})
export class GlobalMasterModule {}
