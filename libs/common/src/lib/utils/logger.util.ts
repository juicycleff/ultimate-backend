import { Logger } from '@nestjs/common';
import { LoggerService } from '@nestjs/common/services/logger.service';

export class LoggerUtil implements LoggerService {
  logger = new Logger();
  enabled = true;

  constructor(context?: string, enabled?: boolean) {
    this.logger = new Logger(context);
    this.enabled = enabled;
  }

  debug(message: any, context?: string, show?: boolean): any {
    if (this.enabled || show) {
      this.logger.debug(message, context);
    }
  }

  error(message: any, trace?: string, context?: string, show?: boolean): any {
    this.logger.error(message, context);
  }

  log(message: any, context?: string, show?: boolean): any {
    this.logger.log(message, context);
  }

  verbose(message: any, context?: string, show?: boolean): any {
    if (this.enabled || show) {
      this.logger.verbose(message, context);
    }
  }

  warn(message: any, context?: string, show?: boolean): any {
    this.logger.warn(message, context);
  }
}
