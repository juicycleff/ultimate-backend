import { Module } from '@nestjs/common';
import { EventStoreSubscriptionType, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { InvoiceResolver } from './invoice.resolver';
import { InvoiceQueryHandlers } from '../cqrs';

@Module({
  imports: [
    NestjsEventStoreModule.forFeature({
      featureStreamName: '$ce-invoice',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Volatile,
          stream: '$ce-invoice',
        },
      ],
      eventHandlers: null,
    }),
  ],
  providers: [
    ...InvoiceQueryHandlers,
    InvoiceResolver,
  ],
})
export class InvoiceModule {}
