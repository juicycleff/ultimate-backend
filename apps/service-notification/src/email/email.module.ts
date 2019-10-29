import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { CommandBus, CqrsModule, EventBus } from '@nestjs/cqrs';
import { EventStore, NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { AuthEventHandlers, EmailVerifiedEvent, UserLoggedInEvent, UserRegisteredEvent } from '@graphqlcqrs/core/cqrs';
import { AuthSagas } from './sagas';
import { DoneCallback, Job } from 'bull';
import { BullModule } from 'nest-bull';
import { AuthQueue } from './queue';

@Module({
  imports: [
    CqrsModule,
    NestjsEventStoreModule.forFeature({
      name: 'user',
      resolveLinkTos: false,
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
    ...AuthEventHandlers,
  ],
})
export class EmailModule {
  constructor(
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
    private readonly eventStore: EventStore,
  ) {}

  onModuleInit(): any {
    this.eventStore.setEventHandlers(this.eventHandlers);
    this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
    this.event$.publisher = this.eventStore;
  }

  eventHandlers = {
    UserLoggedInEvent: (data) => new UserLoggedInEvent(data),
    UserRegisteredEvent: (data) => new UserRegisteredEvent(data),
    EmailVerifiedEvent: (data) => new EmailVerifiedEvent(data),
  };
}
