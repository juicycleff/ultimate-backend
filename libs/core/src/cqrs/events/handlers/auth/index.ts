import { UserLoggedInHandler } from './user-loggedin.handler';
import { UserRegisteredHandler } from './user-registered.handler';
import { EmailVerifiedHandler } from './email-verified.handler';

export const AuthEventHandlers = [
  UserRegisteredHandler,
  UserLoggedInHandler,
  EmailVerifiedHandler,
];
