// main-lambda-bootstrap.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup-app'; // <-- Importar la función común
import { INestApplication } from '@nestjs/common';

// Nota: Mantener el nombre de exportación como 'createApp' para que el handler de Lambda lo use.
export async function createApp(): Promise<INestApplication> {
  console.log('[Lambda] Iniciando creación de la app NestJS...');

  try {
    // Nota: El logger: false es útil en Lambda para evitar doble logging al inicio
    const app = await NestFactory.create(AppModule, { logger: false });
    console.log('[Lambda] App NestJS creada. Configurando lógica común...');

    // Lógica de configuración común
    await setupApp(app);

    // IMPORTANTE: En Lambda, se usa app.init() en lugar de app.listen()
    await app.init();

    console.log('[Lambda] App NestJS inicializada correctamente.');
    return app;
  } catch (err) {
    console.error('[Lambda] Error inicializando la app NestJS:', err);
    throw err;
  }
}
