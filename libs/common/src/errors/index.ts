import {ApolloError} from 'apollo-server-express';

export class GraphqlErrors {

  static notFoundError(prefix: string, message: string, code?: string, properties?: any) {
    const msg = `${prefix} with value ${message} not found`;
    return new ApolloError(msg, code || 'NOT_FOUND_ERROR', properties);
  }
}
