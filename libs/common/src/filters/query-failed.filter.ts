import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { STATUS_CODES } from 'http';
import { QueryFailedError } from 'typeorm';

import { ConstraintErrors } from './constraint-errors';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {

  constructor(public reflector: Reflector) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorMessage = ConstraintErrors[exception.constraint];

    const status = exception.constraint &&
    exception.constraint.startsWith('UQ') ? HttpStatus.CONFLICT : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      error: STATUS_CODES[status],
      message: errorMessage,
    });

  }
}
