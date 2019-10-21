import { GetAuthHandler } from './get-auth.handler';
import { AuthExistHandler } from './auth-exist.handler';

export const AuthQueryHandlers = [
  GetAuthHandler,
  AuthExistHandler,
];
