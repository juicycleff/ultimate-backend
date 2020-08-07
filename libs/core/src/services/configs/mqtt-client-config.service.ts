import { Injectable } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConsulDatabaseConfig } from '@ultimatebackend/common';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { Boot, InjectBoot } from '@nestcloud/boot';
import { NestCloud } from '@nestcloud/core';

@Injectable()
export class MqttClientConfigService {
  constructor(@InjectBoot() private readonly boot: Boot) {}

  getValues(): FactoryProvider<any> {
    const database = this.boot.get<ConsulDatabaseConfig>('database');

    return {
      provide: 'MQTT_CLIENT_SERVICE_XYZ',
      useFactory: () => {
        // @ts-ignore
        return ClientProxyFactory.create({
          transport: Transport.MQTT,
          options: {
            port: parseInt(NestCloud.global.boot.get('mqtt.port'), 10),
            hostname: NestCloud.global.boot.get('mqtt.hostname'),
            username: NestCloud.global.boot.get('mqtt.username'),
            password: NestCloud.global.boot.get('mqtt.password'),
            clientId:
              NestCloud.global.boot.get('service.name') +
              Math.random().toString(16).substr(2, 8),
          },
        });
      },
    };
  }
}
