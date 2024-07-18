import { FirebaseService } from './../common/firebase.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FarmerService } from './farmer.service';
import { FarmerController } from './farmer.controller';
import { Farmer, FarmerSchema } from './farmer.schema';
import { FarmerRepository } from './farmer.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Farmer.name, schema: FarmerSchema }]),
  ],
  controllers: [FarmerController],
  providers: [FarmerService, FarmerRepository, FirebaseService],
})
export class FarmerModule {}
