import { DynamicModule, Global, Module } from '@nestjs/common';
import { NestjsEventStoreService } from './nestjs-event-store.service';
import { EventStoreOptionConfig } from './event-store-option.config';
import { ProvidersConstants } from './nestjs-event-store.constant';
import { EventStore } from './event-store';
import { IEventStoreConnectConfig } from './contract/event-store-connect-config.interface';

@Global()
@Module({
  providers: [NestjsEventStoreService],
  exports: [NestjsEventStoreService],
})
export class NestjsEventStoreModule {
  static forRoot(option: IEventStoreConnectConfig): DynamicModule {
    return {
      module: NestjsEventStoreModule,
      providers: [
        {
          provide: ProvidersConstants.EVENT_STORE_CONNECTION_CONFIG_PROVIDER,
          useValue: {
            ...option,
          },
        },
      ],
    };
  }

  static forFeature(config: EventStoreOptionConfig): DynamicModule {

    if (config === undefined || config === null) {
      config = {
        name: 'DefaultStream',
      };
    }

    return {
      module: NestjsEventStoreModule,
      providers: [
        {
          provide: ProvidersConstants.EVENT_STORE_STREAM_CONFIG_PROVIDER,
          useValue: {
            ...config,
          },
        },
        EventStore,
      ],
      exports: [
        EventStore,
      ],
    };
  }
}
