import * as mqtt from 'mqtt';
import { MQTTPubSub } from 'graphql-mqtt-subscriptions';
import { Logger } from '@nestjs/common';
import { NatsPubSub } from '@moonwalker/graphql-nats-subscriptions';
import { EtcdConfig } from '@nestcloud/config/etcd-config';

export class SubscriptionBaseClass {
  public pubsub: MQTTPubSub | NatsPubSub;
  public mqttClient: mqtt.Client;
  public logger = new Logger(this.constructor.name);

  initMqtt(config: EtcdConfig, { name }) {
    const mqttConfig = config.get<{
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

  initNats(config: EtcdConfig) {
    try {
      const natsConfig = config.get<{
        servers: string[];
        url: string;
      }>('nats');

      this.logger.log(natsConfig);

      this.pubsub = new NatsPubSub({ servers: natsConfig.servers });
    } catch (e) {
      this.logger.error(e);
    }
  }

  async closeAsyncClients() {
    await this.mqttClient.end(true);
  }
}
