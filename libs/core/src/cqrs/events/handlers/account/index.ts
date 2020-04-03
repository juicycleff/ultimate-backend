import { UserLoggedInHandler } from './user-loggedin.handler';
import { UserRegisteredHandler } from './user-registered.handler';
import { EmailVerifiedHandler } from './email-verified.handler';
import { VerificationEmailSentHandler } from './verification-email-sent.handler';
import { ForgotPasswordSentHandler } from './forgot-password-sent.handler';
import { UserPasswordUpdatedHandler } from './user-password-updated.handler';

export const AccountEventHandlers = [
  UserRegisteredHandler,
  UserLoggedInHandler,
  EmailVerifiedHandler,
  VerificationEmailSentHandler,
  ForgotPasswordSentHandler,
  UserPasswordUpdatedHandler,
];
