import { Module } from '@nestjs/common';
import { EmailService, EMAIL_TRANSPORTER } from './email.service';
import * as nodemailer from 'nodemailer';

@Module({
  providers: [
    {
      provide: EMAIL_TRANSPORTER,
      useFactory: () => {
        return nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
      },
    },
    {
      provide: 'FRONTEND_URL',
      useFactory: () => {
        const url = process.env.FRONTEND_URL;
        if (!url) {
          throw new Error('FRONTEND_URL is not defined');
        }
        return url;
      },
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
