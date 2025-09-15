import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { routes } from './main.routes';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { AppLoggerService } from './common/logger/app-logger.service';

@Module({
  imports: [ApiModule, RouterModule.register(routes)],
  controllers: [AppController],
  providers: [AppService, AppLoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
