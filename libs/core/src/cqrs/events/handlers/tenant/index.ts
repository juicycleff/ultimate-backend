import { TenantCreatedHandler } from './tenant-created.handler';
import { TenantRemovedHandler } from './tenant-removed.handler';
import { TenantUpdatedHandler } from './tenant-updated.handler';

export const TenantEventHandlers = [
  TenantCreatedHandler,
  TenantRemovedHandler,
  TenantUpdatedHandler,
];
