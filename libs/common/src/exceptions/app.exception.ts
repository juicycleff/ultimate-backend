import { HttpException, HttpStatus } from '@nestjs/common';

export class AppError extends HttpException {
  constructor(message: string, public metaData?: object) {
    super(message, HttpStatus.BAD_GATEWAY);
    Error.captureStackTrace(this, AppError);
  }
}
