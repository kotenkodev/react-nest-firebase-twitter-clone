import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { INestApplication } from '@nestjs/common';
import { Express } from 'express';

const getCorsOptions = () => {
  const origins = process.env.ALLOWED_ORIGINS;
  if (!origins) return true;
  return origins.split(',').map((origin) => origin.trim());
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

export const api = onRequest({ cors: getCorsOptions() }, async (request, response) => {
  if (!cachedServer) {
    console.log('Initializing NestJS Server...');
    cachedServer = express();
    await bootstrapNestApp(cachedServer);
  }

  cachedServer(request, response);
});

export { updatePostReactionCount } from './triggers/like.trigger';
export { updatePostCommentCount } from './triggers/comment.trigger';
export { onUserAccountDeleted } from './triggers/user.trigger';
export { onPostDeleted } from './triggers/post.trigger';
