import { Inject, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { getVerificationEmailHtml } from './templates/verify-email';
import { getPasswordResetEmailHtml } from './templates/reset-password';

export const EMAIL_TRANSPORTER = 'EMAIL_TRANSPORTER';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @Inject(EMAIL_TRANSPORTER)
    private readonly transporter: nodemailer.Transporter,
    @Inject('FRONTEND_URL') private readonly frontendUrl: string,
  ) {}

  async sendEmailAddressVerificationEmail(
    to: string,
    oobCode: string,
  ): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"Birb" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Verify your email address',
        html: getVerificationEmailHtml(this.frontendUrl, oobCode),
      });
      return true;
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${to}`, error);
      return false;
    }
  }

  async sendPasswordResetEmail(to: string, oobCode: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"Birb" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Reset your password',
        html: getPasswordResetEmailHtml(this.frontendUrl, oobCode),
      });
      return true;
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${to}`, error);
      return false;
    }
  }
}
