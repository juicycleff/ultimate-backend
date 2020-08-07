import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as getPort from 'get-port';
import { NestCloud } from '@nestcloud/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { SERVICE_NAME } from './constants';

async function bootstrap() {
  const app = NestCloud.create(
    await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    ),
  );

  const port = await getPort();
  await app.listen(NestCloud.global.boot.get('service.port', port));
  Logger.log(`${SERVICE_NAME} running on: ${await app.getUrl()}`, 'Bootstrap');
}

(async () => bootstrap())();
