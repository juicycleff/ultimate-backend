import { ReadWebhookHandler } from './read-webhook.handler';
import { FindWebhookHandler } from './find-webhook.handler';

export const WebhookQueryHandlers = [ReadWebhookHandler, FindWebhookHandler];
