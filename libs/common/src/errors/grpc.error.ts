import { ServiceError as GrpcServiceError } from 'grpc';

// Copied from apollo-server-errors
export class ServiceError extends Error implements GrpcServiceError {
  public extensions: Record<string, any>;
  readonly name;
  readonly locations;
  readonly path;
  readonly source;
  readonly positions;
  readonly nodes;
  public originalError;

  [key: string]: any;

  constructor(
    message: string,
    code?: string,
    extensions?: Record<string, any>,
  ) {
    super(message);
    if (extensions) {
      Object.keys(extensions)
        .filter((keyName) => keyName !== 'message' && keyName !== 'extensions')
        .forEach((key) => {
          this[key] = extensions[key];
        });
    }

    if (!this.name) {
      Object.defineProperty(this, 'name', { value: 'ServiceError' });
    }

    const userProvidedExtensions =
      (extensions && extensions.extensions) || null;

    this.extensions = { ...extensions, ...userProvidedExtensions, code };
  }
}

export class NotFoundRpcException extends ServiceError {
  constructor(message: string, properties?: { [key: string]: any }) {
    super(message, 'NOT_FOUND_RPC_EXCEPTION', properties);
    Object.defineProperty(this, 'name', { value: 'NotFoundRpcException' });
  }
}
