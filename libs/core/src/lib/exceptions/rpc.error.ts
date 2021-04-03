/* tslint:disable:max-classes-per-file */

import { RpcException } from '@nestjs/microservices';

export enum GrpcExceptionStatus {
  NOT_FOUND_EXCEPTION,
  BAD_REQUEST_EXCEPTION,
  UNSUPPORTED_MEDIATYPE_EXCEPTION,
  VALIDATION_EXCEPTION,
  PAYLOAD_TOO_LARGE_EXCEPTION,
  NOT_IMPLEMENTED_EXCEPTION,
  UNAUTHORIZED_EXCEPTION,
  REQUEST_TIMEOUT_EXCEPTION,
  METHOD_NOT_ALLOWED_EXCEPTION,
  FORBIDDEN_EXCEPTION,
  CONFLICT_EXCEPTION,
}

export class NotFoundRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: GrpcExceptionStatus.NOT_FOUND_EXCEPTION });
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
