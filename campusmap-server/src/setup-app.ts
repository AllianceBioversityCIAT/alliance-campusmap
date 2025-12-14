// src/setup-app.ts

import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpAdapterHost } from '@nestjs/core';
import { AppLoggerService } from './common/logger/app-logger.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import * as path from 'node:path';

/**
 * Configura la aplicación NestJS con filtros globales, prefijos, CORS y Swagger.
 * @param app Instancia de la aplicación NestJS.
 */
export async function setupApp(app: INestApplication): Promise<void> {
  // Configuración de Logger y Filtros Globales
  const appLogger = await app.resolve(AppLoggerService);
  app.useLogger(appLogger);
  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(adapterHost, appLogger));
  app.setGlobalPrefix('api/v1');

  // Configuración de CORS
  if (!process.env.CORS_ALLOW) {
    appLogger.error(
      'Error: La variable de entorno CORS_ALLOW no está definida',
    );
    process.exit(1);
  }

  const corsOrigins = process.env.CORS_ALLOW.split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (corsOrigins.length === 0) {
    appLogger.error(
      'Error: La variable CORS_ALLOW está vacía o no contiene orígenes válidos',
    );
    process.exit(1);
  }

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('CampusMap Server')
    .setDescription('API de CampusMap')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  appLogger.log(`CORS habilitado para: ${corsOrigins.join(', ')}`);
  console.log(
    "Ruta absoluta calculada para 'public':",
    path.resolve(__dirname, '..', 'public'),
  );
}
