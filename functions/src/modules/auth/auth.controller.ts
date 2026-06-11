import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import type { DecodedIdToken } from 'firebase-admin/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  healthCheck() {
    return { status: 'ok' };
  }

  @Post('signup')
  @UseGuards(FirebaseAuthGuard)
  async signUp(
    @GetUser() user: DecodedIdToken,
    @Body() userData: { firstName: string; lastName: string },
  ) {
    return this.authService.syncUser(user.uid, user.email!, {
      firstName: userData.firstName,
      lastName: userData.lastName,
    });
  }

  @Post('signin')
  @UseGuards(FirebaseAuthGuard)
  async signIn(
    @GetUser() user: DecodedIdToken,
    @Body() bodyData?: { firstName?: string; lastName?: string },
  ) {
    let firstName = bodyData?.firstName;
    let lastName = bodyData?.lastName;

    if (!firstName && !lastName && user.name) {
      const [tokenFirstName, ...tokenLastNameParts] = user.name.split(' ');
      firstName = tokenFirstName;
      lastName = tokenLastNameParts.join(' ');
    }

    return this.authService.syncUser(user.uid, user.email!, {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      photoURL: user.picture,
    });
  }
}
