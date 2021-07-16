/* tslint:disable:max-classes-per-file */
import { ServiceError } from './grpc.error';
import { isObject, isString } from '@nestjs/common/utils/shared.utils';

export class RpcException extends Error {
  constructor(private readonly error: string | object) {
    super();
    this.initMessage();
  }

  public initMessage() {
    if (isString(this.error)) {
      this.message = this.error;
    } else if (
      isObject(this.error) &&
      isString((this.error as Record<string, any>).message)
    ) {
      this.message = (this.error as Record<string, any>).message;
    } else if (this.constructor) {
      this.message = this.constructor.name
        .match(/[A-Z][a-z]+|[0-9]+/g)
        .join(' ');
    }
  }

  public getError(): string | object {
    return this.error;
  }
}

export enum GrpcExceptionStatus {
  NOT_FOUND_EXCEPTION = 'NOT_FOUND_EXCEPTION',
  BAD_REQUEST_EXCEPTION = 'BAD_REQUEST_EXCEPTION',
  UNSUPPORTED_MEDIATYPE_EXCEPTION = 'UNSUPPORTED_MEDIATYPE_EXCEPTION',
  VALIDATION_EXCEPTION = 'VALIDATION_EXCEPTION',
  PAYLOAD_TOO_LARGE_EXCEPTION = 'PAYLOAD_TOO_LARGE_EXCEPTION',
  NOT_IMPLEMENTED_EXCEPTION = 'NOT_IMPLEMENTED_EXCEPTION',
  UNAUTHORIZED_EXCEPTION = 'UNAUTHORIZED_EXCEPTION',
  REQUEST_TIMEOUT_EXCEPTION = 'REQUEST_TIMEOUT_EXCEPTION',
  METHOD_NOT_ALLOWED_EXCEPTION = 'METHOD_NOT_ALLOWED_EXCEPTION',
  FORBIDDEN_EXCEPTION = 'FORBIDDEN_EXCEPTION',
  CONFLICT_EXCEPTION = 'CONFLICT_EXCEPTION',
}

export class NotFoundRpcException extends ServiceError {
  constructor(message: string, properties?: { [key: string]: any }) {
    super(message, GrpcExceptionStatus.NOT_FOUND_EXCEPTION, properties);
    Object.defineProperty(this, 'name', {
      value: GrpcExceptionStatus.NOT_FOUND_EXCEPTION,
    });
  }
}

export class BadRequestRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: GrpcExceptionStatus.BAD_REQUEST_EXCEPTION });
  }
}

export class UnsupportedMediaTypeRpcException extends RpcException {
  constructor(message: string) {
    super({
      message,
      code: GrpcExceptionStatus.UNSUPPORTED_MEDIATYPE_EXCEPTION,
    });
  }
}

export class ForbiddenRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: GrpcExceptionStatus.FORBIDDEN_EXCEPTION });
  }
}

export class ConflictRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: GrpcExceptionStatus.CONFLICT_EXCEPTION });
  }
}

export class MethodNotAllowedRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: GrpcExceptionStatus.METHOD_NOT_ALLOWED_EXCEPTION });
  }
}

export class RequestTimeoutRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: GrpcExceptionStatus.REQUEST_TIMEOUT_EXCEPTION });
  }
}

export class UnauthorizedRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: GrpcExceptionStatus.UNAUTHORIZED_EXCEPTION });
  }
}

export class NotImplementedRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: GrpcExceptionStatus.NOT_IMPLEMENTED_EXCEPTION });
  }
}

export class PayloadTooLargeRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: GrpcExceptionStatus.PAYLOAD_TOO_LARGE_EXCEPTION });
  }
}

export class ValidationRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: GrpcExceptionStatus.VALIDATION_EXCEPTION });
  }
}
