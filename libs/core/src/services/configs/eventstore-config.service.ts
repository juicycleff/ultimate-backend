import { Injectable } from '@nestjs/common';
import { InjectConfig, ConsulConfig } from '@nestcloud/config';
import { EventStoreOptionsFactory, EventStoreModuleOptions } from '@juicycleff/nestjs-event-store';
import { ConsulDatabaseConfig } from '@ultimatebackend/common';

@Injectable()
export class EventstoreConfigService implements EventStoreOptionsFactory {
  constructor(
    @InjectConfig() private readonly config: ConsulConfig,
  ) {}

  createEventStoreOptions(connectionName?: string): EventStoreModuleOptions | Promise<EventStoreModuleOptions> {
    const database = this.config.get<ConsulDatabaseConfig>('database');

    return {
      tcpEndpoint: {
        host: database.eventstore.hostname,
        port: database.eventstore.tcpPort,
      },
      options: {
        defaultUserCredentials: {
          password: database.eventstore?.tcpPassword,
          username: database.eventstore?.tcpUsername,
        },
      },
    };
  }
}
