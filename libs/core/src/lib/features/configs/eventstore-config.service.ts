import { Injectable } from '@nestjs/common';
import { InjectConfig } from '@nestcloud/config';
import { KubernetesConfig } from '@nestcloud/config/config.kubernetes';
import {
  EventStoreOptionsFactory,
  EventStoreModuleOptions,
} from '@juicycleff/nestjs-event-store';
import { SharedTransportConfig } from '@livents/common';

@Injectable()
export class EventstoreConfigService implements EventStoreOptionsFactory {
  constructor(@InjectConfig() private readonly config: KubernetesConfig) {}

  createEventStoreOptions(
    connectionName?: string
  ): EventStoreModuleOptions | Promise<EventStoreModuleOptions> {
    const transport = this.config.get<SharedTransportConfig>('transport');

    return {
      type: 'nats',
      groupId: transport.natStreaming?.groupId,
      clusterId: transport.natStreaming?.clusterId,
      clientId: transport.natStreaming?.clientId,
      options: {
        url: transport.natStreaming?.url,
        reconnect: true,
        maxReconnectAttempts: -1,
      },
    };
  }
}
