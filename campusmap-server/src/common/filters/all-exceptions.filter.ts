import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { AppLoggerService } from '../logger/app-logger.service';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly logger: AppLoggerService,
  ) {
    super(adapterHost.httpAdapter);
  }

  override catch(exception: unknown, host: ArgumentsHost) {
    try {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest<Request>();
      const response = ctx.getResponse<Response>();

      const method = request.method;
      const url = request.url;
      const statusCode = response.statusCode;

      const extract = (): { message: string; stack?: string } => {
        if (exception instanceof Error) {
          return { message: exception.message, stack: exception.stack };
        }
        if (typeof exception === 'string') {
          return { message: exception };
        }
        try {
          return { message: JSON.stringify(exception) };
        } catch {
          return { message: 'Unknown error' };
        }
      };
      const { message: errMsg, stack } = extract();

      this.logger.error(
        { event: 'http_error', method, url, statusCode, message: errMsg },
        stack,
      );
    } catch {
      // swallow logging errors
    }

    super.catch(exception, host);
  }
}
