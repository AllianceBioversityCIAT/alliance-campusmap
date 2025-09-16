// main-lambda-bootstrap.ts
// Bootstrap file for Lambda, exports a function to create the Nest app

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function createApp() {
  console.log('[Lambda] Iniciando creación de la app NestJS...');
  try {
    const app = await NestFactory.create(AppModule, { logger: false });
    console.log('[Lambda] App NestJS creada. Configurando Swagger...');

    // Swagger config (igual que en main.ts)
    const config = new DocumentBuilder()
      .setTitle('CampusMap Server')
      .setDescription('API de CampusMap')
      .setVersion('1.0.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    await app.init();
    console.log('[Lambda] App NestJS inicializada correctamente.');
    return app;
  } catch (err) {
    console.error('[Lambda] Error inicializando la app NestJS:', err);
    throw err;
  }
}
