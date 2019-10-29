import { UserLoggedInHandler } from './user-loggedin.handler';
import { UserRegisteredHandler } from './user-registered.handler';

export const AuthEventHandlers = [
  UserRegisteredHandler,
  UserLoggedInHandler,
];
