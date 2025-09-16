// main-lambda-bootstrap.ts
// Bootstrap file for Lambda, exports a function to create the Nest app

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function createApp() {
  const app = await NestFactory.create(AppModule, { logger: false });

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
  return app;
}
