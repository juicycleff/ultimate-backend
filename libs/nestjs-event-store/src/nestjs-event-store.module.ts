import { DynamicModule, Global, Module } from '@nestjs/common';
import { EventStoreOptionConfig } from './event-store-option.config';
import { ProvidersConstants } from './nestjs-event-store.constant';
import { EventStore } from './event-store';
import { IEventStoreConnectConfig } from './contract/event-store-connect-config.interface';
import { eventStoreProviders } from './nestjs-event-store.provider';

@Global()
@Module({
  providers: [
    ...eventStoreProviders,
    {
      provide: 'EVENT_STORE_CONFIG',
      useValue: 'EVENT_STORE_CONFIG_USE_ENV',
    },
  ],
  exports: [
    ...eventStoreProviders,
    {
      provide: 'EVENT_STORE_CONFIG',
      useValue: 'EVENT_STORE_CONFIG_USE_ENV',
    },
  ],
})
export class NestjsEventStoreModule {
  static forRoot(option: IEventStoreConnectConfig): DynamicModule {
    const configProv = {
        provide: ProvidersConstants.EVENT_STORE_CONNECTION_CONFIG_PROVIDER,
        useValue: {
          ...option,
        },
      };
    return {
      module: NestjsEventStoreModule,
      providers: [configProv],
      exports: [configProv],
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
