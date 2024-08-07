import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GlobalMaster, GlobalMasterDocument } from './global-master.schema';

export class GlobalMasterRepository {
  constructor(
    @InjectModel(GlobalMaster.name)
    private globalMasterModel: Model<GlobalMasterDocument>,
  ) {}

  async create(
    globalMaster: GlobalMaster,
    userId: string,
  ): Promise<GlobalMaster> {
    globalMaster.createdBy = userId;
    globalMaster.user = userId;
    const newGlobalMaster = new this.globalMasterModel(globalMaster);
    return newGlobalMaster.save();
  }

  async findOne(id: string): Promise<GlobalMaster> {
    return this.globalMasterModel.findOne({ createdBy: id }).exec();
  }

  async update(
    id: string,
    globalMaster: Partial<GlobalMaster>,
  ): Promise<GlobalMaster> {
    return this.globalMasterModel
      .findOneAndUpdate({ createdBy: id }, globalMaster, { new: true })
      .exec();
  }

  async findByPhone(
    phone: string,
    userId: string,
  ): Promise<GlobalMaster | null> {
    return this.globalMasterModel
      .findOne({ phone }, { createdBy: userId })
      .exec();
  }

  async findByEmail(
    email: string,
    userId: string,
  ): Promise<GlobalMaster | null> {
    return this.globalMasterModel
      .findOne({ email }, { createdBy: userId })
      .exec();
  }

  async highestCodeGlobalMaster(codePrefix: any) {
    return this.globalMasterModel
      .findOne({ code: { $regex: `^${codePrefix}` } })
      .sort({ code: -1 })
      .select('code')
      .exec();
  }
}
