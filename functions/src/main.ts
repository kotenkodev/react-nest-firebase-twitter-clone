import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express, { Express } from 'express';
import { onRequest, HttpsFunction } from 'firebase-functions/v2/https';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { INestApplication } from '@nestjs/common';

const getCorsOptions = (): string[] => {
  const envOrigins = process.env.ALLOWED_ORIGINS;
  const defaultOrigins = [
    'https://birb-b5cf.web.app',
    'https://birb-b5fcf.firebaseapp.com',
  ];
  return envOrigins
    ? envOrigins.split(',').map((o) => o.trim())
    : defaultOrigins;
};

const configureApp = (app: INestApplication) => {
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: getCorsOptions(),
    credentials: true,
  });
};

let cachedServer: Express | undefined;

const bootstrapNestApp = async (expressInstance: Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  configureApp(app);
  await app.init();
};

export const api: HttpsFunction = onRequest(async (request, response) => {
  if (!cachedServer) {
    console.log('Initializing NestJS Server...');
    cachedServer = express();
    await bootstrapNestApp(cachedServer);
  }
  cachedServer(request, response);
});

export { updatePostReactionCount } from './triggers/like.trigger';
export { updatePostCommentCount } from './triggers/comment.trigger';
export { onUserAccountDeleted, onUserUpdated } from './triggers/user.trigger';
export { onPostDeleted } from './triggers/post.trigger';
export { cleanupOrphanedComments } from './triggers/cleanup.trigger';
