import { MqttOptions, Transport } from '@nestjs/microservices';
import { connect } from 'mqtt';
import { MQTTPubSub } from 'graphql-mqtt-subscriptions';
import { AppConfig } from '@ultimatebackend/common/services/yaml.service';

export function getMqttOptions(): MqttOptions {
  return {
    transport: Transport.MQTT,
    options: {
      port: parseInt(AppConfig.services?.pointRealtime?.mqtt?.port, 10),
      hostname: AppConfig.services?.pointRealtime?.mqtt?.host,
      username: AppConfig.services?.pointRealtime?.mqtt?.username,
      password: AppConfig.services?.pointRealtime?.mqtt?.password,
    },
  };
}

const mqttUrl = `${getMqttOptions().options.protocol}://${getMqttOptions().options.hostname}:${getMqttOptions().options.port}`;

const mqttClient = connect(mqttUrl, {
  ...getMqttOptions().options,
});

export const pubsub = new MQTTPubSub({
  // @ts-ignore
  client: mqttClient,
});
