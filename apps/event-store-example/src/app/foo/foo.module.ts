import { Module } from '@nestjs/common';
import { FooController } from './foo.controller';
import { FooService } from './foo.service';
import { HeroKilledDragonHandler } from './hero-killed-dragon.handler';
import { KillDragonHandler } from './kill-dragon.handler';
import {
  EventStoreBrokerTypes,
  EventStoreModule,
  EventStoreSubscriptionType,
} from '@ultimate-backend';
import { HeroKilledDragonEvent } from './types';
import { CqrsModule } from '@nestjs/cqrs';
import { HeroesGameSagas } from './heroes-game.saga';

export const CommandHandlers = [KillDragonHandler];
export const EventHandlers = [HeroKilledDragonHandler];

@Module({
  imports: [
    CqrsModule,
    EventStoreModule.forFeature({
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Standard,
          streamName: '$et-user',
        },
      ],
      type: EventStoreBrokerTypes.EventStore,
      streamName: '$et-user',
      eventHandlers: {
        HeroKilledDragonEvent: ({ heroId, dragonId }) =>
          new HeroKilledDragonEvent(heroId, dragonId),
      },
    }),
  ],
  controllers: [FooController],
  providers: [
    FooService,
    ...CommandHandlers,
    ...EventHandlers,
    HeroesGameSagas,
  ],
})
export class FooModule {}
