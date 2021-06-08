/* tslint:disable:max-classes-per-file */
import { ApolloError } from 'apollo-server-express';

export class NotFoundError extends ApolloError {
  constructor(message: string, properties?: { [key: string]: any }) {
    super(message, 'NOT_FOUND_ERROR', properties);
    Object.defineProperty(this, 'name', { value: 'NotFoundError' });
  }
}

export class BadRequestError extends ApolloError {
  constructor(message: string, properties?: { [key: string]: any }) {
    super(message, 'BAD_REQUEST_ERROR', properties);
    Object.defineProperty(this, 'name', { value: 'BadRequestError' });
  }
}

export class UnsupportedMediaTypeError extends ApolloError {
  constructor(message: string, properties?: { [key: string]: any }) {
    super(message, 'UNSUPPORTED_MEDIATYPE_ERROR', properties);
    Object.defineProperty(this, 'name', { value: 'UnsupportedMediaTypeError' });
  }
}

export class ForbiddenError extends ApolloError {
  constructor(message: string, properties?: { [key: string]: any }) {
    super(message, 'FORBIDDEN_ERROR', properties);
    Object.defineProperty(this, 'name', { value: 'ForbiddenError' });
  }
}

export class ConflictError extends ApolloError {
  constructor(message: string, properties?: { [key: string]: any }) {
    super(message, 'CONFLICT_ERROR', properties);
    Object.defineProperty(this, 'name', { value: 'ConflictError' });
  }
}

export class MethodNotAllowedError extends ApolloError {
  constructor(message: string, properties?: { [key: string]: any }) {
    super(message, 'METHOD_NOT_ALLOWED_ERROR', properties);
    Object.defineProperty(this, 'name', { value: 'MethodNotAllowedError' });
  }
}

export class RequestTimeoutError extends ApolloError {
  constructor(message: string, properties?: { [key: string]: any }) {
    super(message, 'REQUEST_TIMEOUT_ERROR', properties);
    Object.defineProperty(this, 'name', { value: 'RequestTimeoutError' });
  }
}

export class UnauthorizedError extends ApolloError {
  constructor(message: string, properties?: { [key: string]: any }) {
    super(message, 'UNAUTHORIZED_ERROR', properties);
    Object.defineProperty(this, 'name', { value: 'UnauthorizedError' });
  }
}

export class NotImplementedError extends ApolloError {
  constructor(message: string, properties?: { [key: string]: any }) {
    super(message, 'NOT_IMPLEMENTED_ERROR', properties);
    Object.defineProperty(this, 'name', { value: 'NotImplementedError' });
  }
}

export class PayloadTooLargeError extends ApolloError {
  constructor(message: string, properties?: { [key: string]: any }) {
    super(message, 'PAYLOAD_TOO_LARGE_ERROR', properties);
    Object.defineProperty(this, 'name', { value: 'PayloadTooLargeError' });
  }
}

export class ValidationError extends ApolloError {
  constructor(message: string, properties?: { [key: string]: any }) {
    super(message, 'VALIDATION_ERROR', properties);
    Object.defineProperty(this, 'name', { value: 'ValidationError' });
  }
}
