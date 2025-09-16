// main-lambda-bootstrap.ts
// Bootstrap file for Lambda, exports a function to create the Nest app
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function createApp() {
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();
  return app;
}
