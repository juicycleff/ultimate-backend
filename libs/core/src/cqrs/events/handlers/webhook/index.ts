import { WebhookCreatedHandler } from './webhook-created.handler';
import { WebhookDeletedHandler } from './webhook-deleted.handler';
import { WebhookUpdatedHandler } from './webhook-updated.handler';

export const WebhookEventHandlers = [
  WebhookCreatedHandler,
  WebhookDeletedHandler,
  WebhookUpdatedHandler,
];
