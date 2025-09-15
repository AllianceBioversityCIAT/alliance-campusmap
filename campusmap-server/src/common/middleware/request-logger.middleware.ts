import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLoggerService } from '../logger/app-logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const ip = (req.headers['x-forwarded-for'] as string) || req.ip;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      this.logger.log(
        'http_request',
        JSON.stringify({
          method,
          url: originalUrl,
          statusCode,
          durationMs: duration,
          contentLength,
          userAgent,
          ip,
        }),
      );
    });

    next();
  }
}
