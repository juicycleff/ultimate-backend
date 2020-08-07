import { INestApplication, Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { NestCloud } from '@nestcloud/core';
import { join } from 'path';
import { AppUtils } from '@ultimatebackend/common';

interface MicroserviceSetupOptions {
  enableMqtt?: boolean;
  enableNats?: boolean;
  hostname?: string;
}

export async function microserviceSetup(
  app: INestApplication,
  protoPath: string,
  options?: MicroserviceSetupOptions,
) {
  const { hostname = '0.0.0.0', enableMqtt, enableNats } = options;

  AppUtils.killAppWithGrace(app);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: `${hostname}:${NestCloud.global.boot.get('service.port')}`,
      package: NestCloud.global.boot.get('service.name'),
      protoPath: join(process.cwd(), `/dist/libs/proto-schema/${protoPath}`),
    },
  });

  if (enableMqtt) {
    app.connectMicroservice({
      transport: Transport.MQTT,
      options: {
        url: NestCloud.global.boot.get('mqtt.url'),
        clientId:
          NestCloud.global.boot.get('service.name') +
          Math.random().toString(16).substr(2, 8),
      },
    });
  }

  if (enableNats) {
    app.connectMicroservice({
      transport: Transport.NATS,
      options: {
        url: NestCloud.global.boot.get('nats.url'),
        queue: 'd4_srv_queue',
      },
    });
  }

  await app.startAllMicroservicesAsync();
  Logger.log(
    `GRPC ${NestCloud.global.boot.get(
      'service.name',
    )} running on port: ${NestCloud.global.boot.get('service.port')}`,
    'Bootstrap',
  );

  await app.listen(null);
  Logger.log(
    `REST ${NestCloud.global.boot.get(
      'service.name',
    )} running on: ${await app.getUrl()}`,
    'Bootstrap',
  );
}
