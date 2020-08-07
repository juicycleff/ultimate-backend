import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestCloud } from '@nestcloud/core';
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
  await microserviceSetup(app, 'proto/access.proto', {
    enableNats: false,
    enableMqtt: false,
  });
}
bootstrap();
