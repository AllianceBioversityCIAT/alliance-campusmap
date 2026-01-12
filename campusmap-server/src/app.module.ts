import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { routes } from './main.routes';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { AppLoggerService } from './common/logger/app-logger.service';
import { buildTypeOrmOptions } from './database/typeorm.config';
import { PlacesModule } from './modules/places/places.module';
import { SitesModule } from './modules/sites/sites.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RoutingModule } from './modules/routing/routing.module';

/**
 * AppModule
 *
 * Main application module that configures and orchestrates all feature modules,
 * middleware, and global services for the CampusMap server.
 *
 * Key features:
 * - Static file serving for public assets (icons, images)
 * - Environment configuration management (.env files)
 * - TypeORM database connection setup
 * - Rate limiting with multiple tiers (short/medium/long)
 * - Global request logging middleware
 * - API routing and versioning
 */
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), 'dist', 'public'),
      serveRoot: '/public/',
      serveStaticOptions: {
        index: false,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => buildTypeOrmOptions(),
    }),
    ApiModule,
    RouterModule.register(routes),
    PlacesModule,
    RoutingModule,
    SitesModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],

  controllers: [AppController],
  providers: [
    AppService,
    AppLoggerService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  /**
   * Configure middleware for the application.
   * Applies RequestLoggerMiddleware to all routes for comprehensive request logging.
   *
   * @param consumer Middleware consumer to apply middleware to routes.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
