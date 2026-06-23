import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FIREBASE_AUTH } from '../firebase/firebase.module';
import { Auth } from 'firebase-admin/auth';
import { EmailService } from '../email/email.service';

interface FirebaseError {
  code?: string;
  message?: string;
}

@Injectable()
export class AuthService {
  private readonly auth: Auth;

  constructor(
    @Inject(FIREBASE_AUTH) private readonly admin: Auth,
    private readonly emailService: EmailService,
  ) {
    this.auth = admin;
  }

  async sendVerificationEmail(email: string) {
    const oobCode = await this.generateOobCode(email, 'VERIFY_EMAIL');
    await this.emailService.sendEmailAddressVerificationEmail(email, oobCode);
  }

  async sendResetPasswordEmail(email: string) {
    const oobCode = await this.generateOobCode(email, 'RESET_PASSWORD');
    await this.emailService.sendPasswordResetEmail(email, oobCode);
  }

  async checkPhone(phoneNumber: string): Promise<boolean> {
    try {
      await this.auth.getUserByPhoneNumber(phoneNumber);
      return true;
    } catch (error) {
      const err = error as FirebaseError;
      if (err?.code === 'auth/user-not-found') {
        return false;
      }
      throw new BadRequestException(
        err?.message || 'Invalid phone number format',
      );
    }
  }

  async generateOobCode(
    email: string,
    action: 'VERIFY_EMAIL' | 'RESET_PASSWORD',
  ) {
    try {
      await this.auth.getUserByEmail(email);
    } catch (error) {
      const err = error as FirebaseError;
      console.error('User lookup error:', err);
      if (err?.code === 'auth/user-not-found') {
        throw new NotFoundException('No user found with this email address');
      }
      if (err?.code === 'auth/invalid-email') {
        throw new BadRequestException('Invalid email format');
      }
      throw new BadRequestException(err?.message || 'Failed to verify user');
    }

    let firebaseLink = '';
    try {
      if (action === 'VERIFY_EMAIL') {
        firebaseLink = await this.auth.generateEmailVerificationLink(email);
      } else if (action === 'RESET_PASSWORD') {
        firebaseLink = await this.auth.generatePasswordResetLink(email);
      }
    } catch (error) {
      const err = error as FirebaseError;
      console.error('Error generating link:', err);
      throw new BadRequestException(err?.message || 'Failed to generate link');
    }

    const url = new URL(firebaseLink);
    const oobCode = url.searchParams.get('oobCode');

    if (!oobCode) {
      throw new Error('Could not extract oobCode from Firebase link');
    }

    return oobCode;
  }
}
