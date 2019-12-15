import { TenantCreatedHandler } from './tenant-created.handler';
import { TenantRemovedHandler } from './tenant-removed.handler';

export const TenantEventHandlers = [
  TenantCreatedHandler,
  TenantRemovedHandler,
];
