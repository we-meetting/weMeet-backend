import * as path from 'path';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { HttpExceptionFilter } from '@common/filters';
import { ResponseInterceptor } from '@common/interceptors';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as requestIp from 'request-ip';

import { AppModule } from './app.module';

dotenv.config({
  path: path.resolve(process.env.NODE_ENV === 'prod' ? '.env' : '.env.local'),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.NODE_ENV === 'prod' ? 'https://wemtmt.com' : 'http://localhost:5173'],
    credentials: true,
  });

  app.enableShutdownHooks();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  app.use(requestIp.mw());
  app.use(cookieParser());

  await app.listen(4000, '0.0.0.0');
}
bootstrap();
