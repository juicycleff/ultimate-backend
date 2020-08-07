import { NestFactory } from '@nestjs/core';
import { NestCloud } from '@nestcloud/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { microserviceSetup } from '@ultimatebackend/core';

async function bootstrap() {
  const app = NestCloud.create(
    await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    ),
  );

  await microserviceSetup(app, 'proto/tenant.proto', {
    enableNats: false,
    enableMqtt: false,
  });
}
(() => bootstrap())();
