import { Injectable } from '@nestjs/common';
import { NestjsEventStore } from './nestjs-event-store.class';
import { ProvidersConstants } from './nestjs-event-store.constant';

@Injectable()
export class NestjsEventStoreService {
  constructor() {
    return {
      provide: ProvidersConstants.EVENT_STORE_PROVIDER,
      useFactory: (eventStoreConfig?: any): any => {
        if (eventStoreConfig === 'EVENT_STORE_CONFIG_USE_ENV') {
          return new NestjsEventStore();
        }
      },
      inject: ['EVENT_STORE_CONFIG'],
    };
  }
}
