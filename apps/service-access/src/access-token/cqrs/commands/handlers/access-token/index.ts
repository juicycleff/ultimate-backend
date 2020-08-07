import { CreateAccessHandler } from './create-access.handler';
import { DeleteAccessHandler } from './delete-access.handler';

export const AccessTokenCommandHandlers = [
  CreateAccessHandler,
  DeleteAccessHandler,
];
