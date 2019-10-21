import { AuthCreatedHandler } from './auth-created.handler';
import { AuthDeletedHandler } from './auth-deleted.handler';
import { AuthUpdatedHandler } from './auth-updated.handler';

export const AuthEventHandlers = [
  AuthCreatedHandler,
  AuthUpdatedHandler,
  AuthDeletedHandler,
];
