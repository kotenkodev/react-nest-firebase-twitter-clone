import { Inject, Injectable } from '@nestjs/common';
import { FIREBASE_AUTH } from '../firebase/firebase.module';
import { Auth } from 'firebase-admin/auth';
import { EmailService } from '../email/email.service';

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

  async generateOobCode(
    email: string,
    action: 'VERIFY_EMAIL' | 'RESET_PASSWORD',
  ) {
    let firebaseLink = '';

    try {
      if (action === 'VERIFY_EMAIL') {
        firebaseLink = await this.auth.generateEmailVerificationLink(email);
      } else if (action === 'RESET_PASSWORD') {
        firebaseLink = await this.auth.generatePasswordResetLink(email);
      }
    } catch (error) {
      console.error('Error generating link:', error);
      throw new Error('Failed to generate Firebase link');
    }

    const url = new URL(firebaseLink);
    const oobCode = url.searchParams.get('oobCode');

    if (!oobCode) {
      throw new Error('Could not extract oobCode from Firebase link');
    }

    return oobCode;
  }
}
