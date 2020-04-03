import { AccessTokenCreatedHandler } from './access-token-created.handler';
import { AccessTokenDeletedHandler } from './access-token-deleted.handler';

export const AccessTokenEventHandlers = [
  AccessTokenCreatedHandler,
  AccessTokenDeletedHandler,
];
