import { LoggerService } from '@nestjs/common';
import { NotImplementedError } from '@ultimatebackend/common/errors';

export class AppLogger implements LoggerService {
  log(message: string) {
    throw new NotImplementedError('Not implemented');
  }

  error(message: string, trace: string) {
    throw new NotImplementedError('Not implemented');
  }

  warn(message: string) {
    throw new NotImplementedError('Not implemented');
  }

  debug(message: string) {
    throw new NotImplementedError('Not implemented');
  }

  verbose(message: string) {
    throw new NotImplementedError('Not implemented');
  }
}
