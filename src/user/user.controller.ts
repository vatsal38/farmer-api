import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { CreateUserDto } from './create-user.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const { username, password, email, firstName, lastName } = createUserDto;
    await this.userService.sendOTP(
      username,
      email,
      firstName,
      lastName,
      password,
    );
    return { message: 'OTP sent to your email' };
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body()
    body: {
      username: string;
      otp: string;
    },
  ) {
    const { username, otp } = body;
    await this.userService.verifyOTP(username, otp);
    return { message: 'Verified successfully.' };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() data: any) {
    return this.userService.login(data);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body()
    body: {
      email: string;
    },
  ) {
    const { email } = body;
    await this.userService.sendPasswordResetOTP(email);
    return { message: 'Password reset OTP sent to your email' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body()
    body: {
      email: string;
      otp: string;
      newPassword: string;
    },
  ) {
    const { email, otp, newPassword } = body;
    await this.userService.resetPassword(email, otp, newPassword);
    return { message: 'Password reset successfully' };
  }
}
