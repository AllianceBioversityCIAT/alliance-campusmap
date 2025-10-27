import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppLoggerService } from './common/logger/app-logger.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpAdapterHost } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appLogger = await app.resolve(AppLoggerService);
  app.useLogger(appLogger);
  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(adapterHost, appLogger));
  app.setGlobalPrefix('api/v1');

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

  appLogger.log(`CORS habilitado para los orígenes: ${corsOrigins.join(', ')}`);

  const config = new DocumentBuilder()
    .setTitle('CampusMap Server')
    .setDescription('API de CampusMap')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  appLogger.log(`Servidor escuchando en http://localhost:${port}`);
  appLogger.log(`Documentación API en http://localhost:${port}/api/docs`);
  appLogger.log(`CORS habilitado para: ${corsOrigins.join(', ')}`);
}
void bootstrap();
