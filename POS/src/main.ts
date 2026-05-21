import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { seedDatabase } from './database/seeds/seed-data';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const apiPrefix = configService.get('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor(),
  );

  // Build CORS origins from env variables
  const defaultOrigins = ['http://localhost:3000', 'http://localhost:3001'];
  const frontendUrl = configService.get('FRONTEND_URL');

  let corsOrigins = (configService.get('CORS_ORIGINS') || defaultOrigins.join(',')).split(',');
  if (frontendUrl && !corsOrigins.includes(frontendUrl)) {
    corsOrigins.push(frontendUrl);
  }

  app.enableCors({
    origin: corsOrigins.map((o: string) => o.trim()),
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('POS System API')
    .setDescription('Restaurant & Café Point of Sale System')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Run database seeding
  const dataSource = app.get(DataSource);
  if (dataSource) {
    try {
      logger.log('🌱 Starting database seeding...');
      await seedDatabase(dataSource);
      logger.log('✅ Database seeding completed');
    } catch (err) {
      logger.error('❌ Database seeding failed:', err);
    }
  }

  const port = configService.get('PORT') || 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`Application running on http://0.0.0.0:${port}`);
}

bootstrap();
