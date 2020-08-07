import * as mqtt from 'mqtt';
import { MQTTPubSub } from 'graphql-mqtt-subscriptions';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  Scope,
} from '@nestjs/common';
import { NatsPubSub } from '@moonwalker/graphql-nats-subscriptions';
import { EtcdConfig } from '@nestcloud/config/etcd-config';
import { InjectConfig } from '@nestcloud/config';

@Injectable({
  scope: Scope.DEFAULT,
})
export class SubscriptionBaseProvider implements OnModuleInit, OnModuleDestroy {
  public pubsub: MQTTPubSub | NatsPubSub;
  public mqttClient: mqtt.Client;
  public logger = new Logger(this.constructor.name);

  constructor(@InjectConfig() private readonly config: EtcdConfig) {}

  initMqtt(name) {
    const mqttConfig = this.config.get<{
      hostname: string;
      username: string;
      password: string;
      port: string;
      protocol: string;
      url: string;
    }>('mqtt');

    if (!this.mqttClient || !this.pubsub || this.mqttClient?.disconnected) {
      this.mqttClient = mqtt.connect(mqttConfig.url, {
        port: parseInt(mqttConfig?.port, 10),
        username: mqttConfig?.username,
        password: mqttConfig?.password,
        clientId: 'api-' + name + '-' + Math.random().toString(16).substr(2, 8),
        reconnectPeriod: 1000,
      }) as mqtt.Client;

      this.pubsub = new MQTTPubSub({
        // @ts-ignore
        client: this.mqttClient,
      });
    }
  }

  initNats() {
    try {
      const natsConfig = this.config.get<{
        servers: string[];
        url: string;
      }>('nats');
      this.pubsub = new NatsPubSub({ servers: natsConfig.servers });
    } catch (e) {
      this.logger.error(e);
    }
  }

  async closeAsyncClients() {
    if (this.mqttClient) {
      await this.mqttClient.end(true);
    }
  }

  onModuleDestroy(): any {
    this.closeAsyncClients();
  }

  onModuleInit(): any {
    // TODO
  }
}
