import {ApolloError} from 'apollo-server-express';

export class NotFoundError extends ApolloError {
  constructor(message: string, properties?: { [key: string]: any }) {
    super(message, 'NOT_FOUND_ERROR', properties);
    Object.defineProperty(this, 'name', {value: 'NotFoundError'});
  }
}
