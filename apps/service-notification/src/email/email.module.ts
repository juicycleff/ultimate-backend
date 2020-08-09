import { Module } from '@nestjs/common';
import {
  EventStoreSubscriptionType,
  EventStoreModule,
} from '@juicycleff/nestjs-event-store';
import {
  EmailVerifiedEvent,
  ForgotPasswordSentEvent,
  UserLoggedInEvent,
  UserRegisteredEvent,
  VerificationEmailSentEvent,
} from '@ultimatebackend/core';
import { BullModule } from '@nestjs/bull';
import { EmailService } from './email.service';
import { AuthSagas } from './sagas';
import { AuthProcess } from './queue';
import { BullConfigService } from '../configs/bull-config.service';

@Module({
  imports: [
    EventStoreModule.registerFeature({
      type: 'event-store',
      featureStreamName: '$ce-account',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Volatile,
          stream: '$ce-account',
        },
      ],
      eventHandlers: {
        UserLoggedInEvent: (data) => new UserLoggedInEvent(data),
        UserRegisteredEvent: (data) => new UserRegisteredEvent(data),
        EmailVerifiedEvent: (data) => new EmailVerifiedEvent(data),
        VerificationEmailSentEvent: (data) =>
          new VerificationEmailSentEvent(data),
        ForgotPasswordSentEvent: (data) => new ForgotPasswordSentEvent(data),
      },
    }),
    BullModule.registerQueueAsync({
      name: 'notification_queue',
      useClass: BullConfigService,
    }),
  ],
  providers: [EmailService, AuthProcess, AuthSagas],
})
export class EmailModule {}
