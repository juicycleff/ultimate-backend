import { NestFactory } from '@nestjs/core';
import { bloodTearsMiddleware } from '@graphqlcqrs/common/middlewares';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

// tslint:disable-next-line:no-var-requires
const config = require('config-yml').load(process.env.NODE_ENV);

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    credentials: true,
    preflightContinue: true,
  });
  app.enableShutdownHooks();
  app.use(bloodTearsMiddleware);

  await app.listenAsync(
    parseInt(process.env.PORT, 10) ||
    parseInt(config.services?.notification?.port,10) ||
    9400,
  );
}
bootstrap();
