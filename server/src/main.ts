import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@/app.module';

const API_VERSION = '1';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const backendPort = configService.getOrThrow<number>('PORT');
  const frontendOrigin = configService.getOrThrow<string>('FRONTEND_ORIGIN');

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
    origin: frontendOrigin,
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

  await app.listen(backendPort);
}

void bootstrap();
