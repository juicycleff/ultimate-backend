import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  EventStoreBrokerTypes,
  EventStoreModule,
} from '@ultimate-backend/event-store';
import { FooModule } from './foo/foo.module';

@Module({
  imports: [
    EventStoreModule.forRoot({
      broker: {
        type: EventStoreBrokerTypes.EventStore,
        connectionSettings: {
          endpoint: 'localhost:2113',
        },
        defaultUserCredentials: {
          password: 'admin',
          username: 'changeit',
        },
        channelCredentials: {
          insecure: true,
        },
      },
    }),
    FooModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
