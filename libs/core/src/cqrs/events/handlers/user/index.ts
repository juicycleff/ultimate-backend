import { UserCreatedHandler } from './user-created.handler';
import { UserDeletedHandler } from './user-deleted.handler';
import { UserUpdatedHandler } from './user-updated.handler';

export const UserEventHandlers = [
  UserCreatedHandler,
  UserDeletedHandler,
  UserUpdatedHandler,
];
