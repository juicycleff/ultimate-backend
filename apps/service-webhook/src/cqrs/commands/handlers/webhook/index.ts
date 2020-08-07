import { CreateWebhookHandler } from './create-webhook.handler';
import { DeleteWebhookHandler } from './delete-webhook.handler';
import { UpdateWebhookHandler } from './update-webhook.handler';

export const WebhookCommandHandlers = [
  CreateWebhookHandler,
  DeleteWebhookHandler,
  UpdateWebhookHandler,
];
