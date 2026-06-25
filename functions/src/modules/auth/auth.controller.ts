import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('verify-email')
  async sendVerificationEmail(@Body() data: { email: string }) {
    await this.authService.sendVerificationEmail(data.email);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('forgot-password')
  async sendPasswordResetEmail(@Body() data: { email: string }) {
    await this.authService.sendResetPasswordEmail(data.email);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('check-phone')
  async checkPhone(@Body() data: { phoneNumber: string }) {
    const exists = await this.authService.checkPhone(data.phoneNumber);
    return { exists };
  }
}
