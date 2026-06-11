import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import * as admin from 'firebase-admin';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  healthCheck() {
    return { status: 'ok' };
  }

  @Post('signup')
  async signUp(
    @GetUser() user: admin.auth.DecodedIdToken,
    @Body() userData: { firstName: string; lastName: string },
  ) {
    return this.authService.syncUser(user.uid, user.email!, {
      firstName: userData.firstName,
      lastName: userData.lastName,
    });
  }

  @Post('signin')
  @UseGuards(FirebaseAuthGuard)
  async signIn(@GetUser() user: User) {}
}
