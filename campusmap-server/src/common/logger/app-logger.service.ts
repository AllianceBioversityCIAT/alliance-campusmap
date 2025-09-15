import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService extends ConsoleLogger {
  private format(
    level: LogLevel,
    message: unknown,
    meta?: Record<string, unknown>,
  ) {
    const payload = {
      ts: new Date().toISOString(),
      level,
      message,
      context: this.context,
      ...meta,
    };
    return JSON.stringify(payload);
  }

  override log(message: unknown, context?: string) {
    if (context) this.setContext(context);
    super.log(this.format('log', message));
  }

  override error(message: unknown, trace?: string, context?: string) {
    if (context) this.setContext(context);
    super.error(this.format('error', message, trace ? { trace } : undefined));
  }

  override warn(message: unknown, context?: string) {
    if (context) this.setContext(context);
    super.warn(this.format('warn', message));
  }

  override debug(message: unknown, context?: string) {
    if (context) this.setContext(context);
    super.debug(this.format('debug', message));
  }

  override verbose(message: unknown, context?: string) {
    if (context) this.setContext(context);
    super.verbose(this.format('verbose', message));
  }
}
