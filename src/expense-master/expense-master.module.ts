import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseMasterService } from './expense-master.service';
import { ExpenseMasterController } from './expense-master.controller';
import { ExpenseMaster, ExpenseMasterSchema } from './expense-master.schema';
import { ExpenseMasterRepository } from './expense-master.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExpenseMaster.name, schema: ExpenseMasterSchema },
    ]),
  ],
  controllers: [ExpenseMasterController],
  providers: [ExpenseMasterService, ExpenseMasterRepository],
})
export class ExpenseMasterModule {}
