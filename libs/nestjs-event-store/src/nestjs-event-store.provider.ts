import { ProvidersConstants } from './nestjs-event-store.constant';
import { NestjsEventStore } from './nestjs-event-store.class';

export const eventStoreProviders = [
  {
    provide: ProvidersConstants.EVENT_STORE_PROVIDER,
    useFactory: (eventStoreConfig?: any): any => {
      if (eventStoreConfig === 'EVENT_STORE_CONFIG_USE_ENV') {
        return new NestjsEventStore();
      }
    },
    inject: ['EVENT_STORE_CONFIG'],
  },
];
