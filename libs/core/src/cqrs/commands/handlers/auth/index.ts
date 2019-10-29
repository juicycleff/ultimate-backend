import { LoginUserHandler } from './login-user.handler';
import { RegisterUserHandler } from './register-user.handler';
import { VerifyEmailHandler } from './verify-email.handler';

export const AuthCommandHandlers = [LoginUserHandler, RegisterUserHandler, VerifyEmailHandler];
