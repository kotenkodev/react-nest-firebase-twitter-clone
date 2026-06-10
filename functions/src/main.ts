import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

const server = express();

export const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  return app.init();
};

export const api = onRequest(async (request, response) => {
  await createNestServer(server);
  server(request, response);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

if (!process.env.FUNCTIONS_EMULATOR && process.env.NODE_ENV !== 'production') {
  console.log('Running in development mode, starting NestJS server...');
  bootstrap();
}
