// main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup-app'; // <-- Importar la función común
import { AppLoggerService } from './common/logger/app-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Lógica de configuración común
  await setupApp(app);

  const appLogger = await app.resolve(AppLoggerService);

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);

  appLogger.log(`Servidor escuchando en http://localhost:${port}`);
  appLogger.log(`Documentación API en http://localhost:${port}/api/docs`);
}

void bootstrap();
