import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { HttpExceptionFilter } from '@common/filters';
import { ResponseInterceptor } from '@common/interceptors';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
