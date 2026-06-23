import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify-email')
  async sendVerificationEmail(@Body() data: { email: string }) {
    await this.authService.sendVerificationEmail(data.email);
  }

  @Post('forgot-password')
  async sendPasswordResetEmail(@Body() data: { email: string }) {
    await this.authService.sendResetPasswordEmail(data.email);
  }
}
