import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreSubscriptionType, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { EmailVerifiedEvent, UserLoggedInEvent, UserRegisteredEvent } from '@graphqlcqrs/core/cqrs';
import { AuthSagas } from './sagas';
import { DoneCallback, Job } from 'bull';
import { BullModule } from 'nest-bull';
import { AuthQueue } from './queue';

@Module({
  imports: [
    CqrsModule,
    NestjsEventStoreModule.forFeature({
      featureStreamName: '$ce-user',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.CatchUp,
          stream: '$ce-user',
        },
      ],
      eventHandlers: {
        UserLoggedInEvent: (data) => new UserLoggedInEvent(data),
        UserRegisteredEvent: (data) => new UserRegisteredEvent(data),
        EmailVerifiedEvent: (data) => new EmailVerifiedEvent(data),
      },
    }),
    BullModule.register({
      name: 'auth_queue',
      options: {
        redis: {
          host: 'localhost',
          port: 6379,
        },
      },
      processors: [
        (job: Job, done: DoneCallback) => { done(null, job.data); },
      ],
    }),
  ],
  providers: [
    EmailService,
    AuthQueue,
    AuthSagas,
  ],
})
export class EmailModule {}
