import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    const newUser = new this.userModel({
      username,
      password,
      firstName,
      lastName,
    });
    return newUser.save();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async saveOTP(
    username: string,
    otp: string,
    otpExpiration: Date,
    firstName: string,
    lastName: string,
    password: string,
    email: string,
  ): Promise<User> {
    const newUser = new this.userModel({
      username,
      password,
      firstName,
      lastName,
      otp,
      otpExpiration,
      email,
    });
    return newUser.save();
  }

  async findByOTP(otp: string): Promise<User | null> {
    return this.userModel.findOne({ otp }).exec();
  }

  async markAsVerified(username: string): Promise<void> {
    await this.userModel.updateOne({ username }, { isVerified: true }).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async savePasswordResetOTP(
    username: string,
    otp: string,
    otpExpiration: Date,
  ): Promise<void> {
    await this.userModel
      .updateOne(
        { username },
        { resetOtp: otp, resetOtpExpiration: otpExpiration },
      )
      .exec();
  }

  async updatePassword(username: string, newPassword: string): Promise<void> {
    await this.userModel
      .updateOne(
        { username },
        { password: newPassword, resetOtp: null, resetOtpExpiration: null },
      )
      .exec();
  }

  async update(
    username: string,
    otp: string,
    otpExpiration: Date,
  ): Promise<void> {
    await this.userModel.updateOne({ username }, { otp, otpExpiration }).exec();
  }
}
