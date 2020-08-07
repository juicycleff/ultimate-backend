import { Module } from '@nestjs/common';
import { WebhooksResolver } from './webhooks.resolver';
import { WebhooksMutationResolver } from './webhooks-mutation.resolver';

@Module({
  providers: [WebhooksResolver, WebhooksMutationResolver],
})
export class WebhooksModule {}
