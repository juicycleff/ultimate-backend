import { Injectable } from '@nestjs/common';
import { InjectConfig } from '@nestcloud/config';
import { EtcdConfig } from '@nestcloud/config/etcd-config';
import {
  EventStoreOptionsFactory,
  EventStoreModuleOptions,
} from '@juicycleff/nestjs-event-store';
import { ConsulDatabaseConfig } from '@ultimatebackend/common';

@Injectable()
export class EventstoreConfigService implements EventStoreOptionsFactory {
  constructor(@InjectConfig() private readonly config: EtcdConfig) {}

  createEventStoreOptions(
    connectionName?: string,
  ): EventStoreModuleOptions | Promise<EventStoreModuleOptions> {
    const database = this.config.get<ConsulDatabaseConfig>('database');

    return {
      type: 'event-store',
      tcpEndpoint: {
        host: database?.eventstore?.hostname,
        port: database?.eventstore?.tcpPort,
      },
      options: {
        defaultUserCredentials: {
          password: database?.eventstore?.tcpPassword,
          username: database?.eventstore?.tcpUsername,
        },
      },
    };
  }
}
