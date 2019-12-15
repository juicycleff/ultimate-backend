import { Transport } from '@nestjs/microservices';
import { INestApplication } from '@nestjs/common';
import { join } from 'path';

export async function setupGrpc(
  app: INestApplication, packageName, fileName: string, port: number, host: string = '0.0.0.0',
) {
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: `${host}:${port}`,
      package: packageName,
      protoPath: join(`proto/${fileName}`),
    },
  });

  await app.startAllMicroservicesAsync();
}
