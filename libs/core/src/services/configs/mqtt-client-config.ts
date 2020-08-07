import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export const MQTT_CONFIG_SERVICE = 'MQTT_CONFIG_SERVICE_XYZ';

export const MqttClientConfig = {
  provide: MQTT_CONFIG_SERVICE,
  useFactory: (config: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.MQTT,
      options: {
        url: config.get('MQTT_URL'),
        clientId: 'd4_api' + Math.random().toString(16).substr(2, 8),
      },
    });
  },
  inject: [ConfigService],
};
