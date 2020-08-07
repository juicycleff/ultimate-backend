import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestCloud } from '@nestcloud/core';
import { microserviceSetup } from '@ultimatebackend/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = NestCloud.create(
    await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    ),
  );
  await microserviceSetup(app, 'proto/role.proto', {
    enableNats: false,
    enableMqtt: false,
  });
}

(async () => await bootstrap())();
