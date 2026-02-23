import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from '@/app.module';

const API_VERSION = '1';

export async function createConfiguredApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: API_VERSION,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? '*',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Bond Yield Calculator API')
    .setDescription(
      'REST API for calculating bond yield metrics including current yield, yield to maturity, and cash flow schedules.',
    )
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  return app;
}
