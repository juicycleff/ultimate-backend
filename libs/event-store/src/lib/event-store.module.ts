import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  EventStoreBrokerTypes,
  EventStoreFeatureAsyncOptions,
  EventStoreFeatureOptions,
  EventStoreFeatureOptionsFactory,
  EventStoreModuleAsyncOptions,
  EventStoreModuleOptions,
  EventStoreModuleOptionsFactory,
} from './interface';
import {
  EVENT_STORE_FEATURE_OPTION,
  EVENT_STORE_MODULE_OPTION,
  ProvidersConstants,
} from './event-store.constant';
import { getClientProvider, getClientProviderAsync } from './utils';
import { StanBroker, EventStoreBroker, GooglePubsubBroker, KafkaBroker } from './broker';
import { ExplorerService } from '@nestjs/cqrs/dist/services/explorer.service';
import { EventStoreConfig } from './event-store.config';

@Module({
  imports: [CqrsModule],
})
export class EventStoreModule {
  static forRoot(options?: EventStoreModuleOptions): DynamicModule {
    const configOptionProvider = {
      provide: ProvidersConstants.EVENT_STORE_CONFIG,
      useValue: options,
    };

    const clientProvider = getClientProvider(options);

    return {
      module: EventStoreModule,
      imports: [CqrsModule],
      providers: [configOptionProvider, EventStoreConfig, ...clientProvider],
      exports: [CqrsModule, EventStoreConfig, ...clientProvider],
      global: options?.global || true,
    };
  }

  static forRootAsync(options: EventStoreModuleAsyncOptions): DynamicModule {
    const clientProvider = getClientProviderAsync();
    const configOptionProvider: Provider = {
      provide: ProvidersConstants.EVENT_STORE_CONFIG,
      useFactory: async (esOptions: EventStoreModuleOptions) => {
        return {
          ...esOptions,
        };
      },
      inject: [EVENT_STORE_MODULE_OPTION],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: EventStoreModule,
      imports: [CqrsModule],
      providers: [
        ...asyncProviders,
        configOptionProvider,
        EventStoreConfig,
        clientProvider,
      ],
      exports: [CqrsModule, clientProvider],
      global: options.global || true,
    };
  }

  static forFeature(options: EventStoreFeatureOptions): DynamicModule {
    if (options === undefined || options === null) {
      throw new Error('for feature options missing');
    }

    let CurrentStore;
    if (options.type === EventStoreBrokerTypes.Stan) {
      CurrentStore = StanBroker;
    } else if (options.type === EventStoreBrokerTypes.GooglePubSub) {
      CurrentStore = GooglePubsubBroker;
    } else if (options.type === EventStoreBrokerTypes.EventStore) {
      CurrentStore = EventStoreBroker;
    } else if (options.type === EventStoreBrokerTypes.Kafka) {
      CurrentStore = KafkaBroker;
    }

    return {
      module: EventStoreModule,
      providers: [
        ExplorerService,
        {
          provide: ProvidersConstants.EVENT_STORE_FEATURE_CONFIG,
          useValue: options,
        },
        CurrentStore,
      ],
      exports: [CurrentStore, ExplorerService],
    };
  }

  static forFeatureAsync(
    options: EventStoreFeatureAsyncOptions
  ): DynamicModule {
    if (options === undefined || options === null) {
      throw new Error('for feature options missing');
    }
    const configProv: Provider = {
      provide: ProvidersConstants.EVENT_STORE_FEATURE_CONFIG,
      useFactory: async (config: EventStoreFeatureOptions) => {
        return config;
      },
      inject: [EVENT_STORE_FEATURE_OPTION],
    };

    const asyncProviders = this.createFeatureAsyncProviders(options);
    let CurrentStore;
    if (options.type === EventStoreBrokerTypes.Stan) {
      CurrentStore = StanBroker;
    } else if (options.type === EventStoreBrokerTypes.GooglePubSub) {
      CurrentStore = GooglePubsubBroker;
    } else if (options.type === EventStoreBrokerTypes.EventStore) {
      CurrentStore = EventStoreBroker;
    } else if (options.type === EventStoreBrokerTypes.Kafka) {
      CurrentStore = KafkaBroker;
    }

    return {
      module: EventStoreModule,
      providers: [...asyncProviders, ExplorerService, configProv, CurrentStore],
      exports: [CurrentStore, ExplorerService],
    };
  }

  private static createAsyncProviders(
    options: EventStoreModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory || options.useExisting) {
      return [this.createAsyncOptionsProviders(options)];
    }

    const useClass = options.useExisting as Type<EventStoreModuleOptionsFactory>;

    return [
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProviders(
    options: EventStoreModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        useFactory: options.useFactory,
        inject: options.inject,
        provide: EVENT_STORE_MODULE_OPTION,
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<EventStoreModuleOptionsFactory>,
    ];

    return {
      provide: EVENT_STORE_MODULE_OPTION,
      useFactory: async (optionsFactory: EventStoreModuleOptionsFactory) =>
        await optionsFactory.createEventStoreOptions(),
      inject,
    };
  }

  private static createFeatureAsyncProviders(
    options: EventStoreFeatureAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createFeatureAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<EventStoreFeatureOptionsFactory>;
    return [
      this.createFeatureAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createFeatureAsyncOptionsProvider(
    options: EventStoreFeatureAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: EVENT_STORE_FEATURE_OPTION,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    const inject = [
      (options.useClass ||
        options.useExisting) as Type<EventStoreFeatureOptionsFactory>,
    ];
    return {
      provide: EVENT_STORE_FEATURE_OPTION,
      useFactory: async (optionsFactory: EventStoreFeatureOptionsFactory) =>
        await optionsFactory.createFeatureOptions(options.name),
      inject,
    };
  }
}
