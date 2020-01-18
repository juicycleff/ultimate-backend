import { LoginUserHandler } from './login-user.handler';
import { RegisterUserHandler } from './register-user.handler';
import { VerifyEmailHandler } from './verify-email.handler';
import { ResendVerificationEmailHandler } from './resend-verification-email.handler';

export const AuthCommandHandlers = [LoginUserHandler, RegisterUserHandler, VerifyEmailHandler, ResendVerificationEmailHandler];
