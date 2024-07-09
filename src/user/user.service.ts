import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async sendOTP(
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findByUsername(username);
      if (user) {
        throw new ConflictException('Username is already exists');
      }
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const otpExpiration = new Date();
      otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userRepository.saveOTP(
        username,
        otp,
        otpExpiration,
        firstName,
        lastName,
        hashedPassword,
        email,
      );

      await this.mailerService.sendMail({
        to: email,
        subject: 'Your OTP Code',
        template: './otp',
        context: {
          otp,
        },
      });
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create user');
      }
    }
  }

  async verifyOTP(username: string, otp: string): Promise<boolean> {
    const user = await this.userRepository.findByUsername(username);
    if (user && user.otp === otp && user.otpExpiration > new Date()) {
      await this.userRepository.markAsVerified(username);
      return true;
    }
    return false;
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findByUsername(username);
    if (
      user &&
      user.isVerified &&
      (await bcrypt.compare(password, user.password))
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async sendPasswordResetOTP(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

    await this.userRepository.savePasswordResetOTP(
      user.username,
      otp,
      otpExpiration,
    );

    await this.mailerService.sendMail({
      to: email,
      subject: 'Your Password Reset OTP',
      template: './otp',
      context: {
        otp,
      },
    });
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (
      !user ||
      user.resetOtp !== otp ||
      user.resetOtpExpiration < new Date()
    ) {
      throw new Error('Invalid or expired OTP');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(user.username, hashedPassword);
  }

  async login(user: any) {
    const userData: any = await this.userRepository.findByUsername(
      user.username,
    );
    const payload = { username: userData.username, sub: userData._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userData._id,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        isVerified: userData.isVerified,
        isProduct: userData.isProduct,
      },
    };
  }
}
