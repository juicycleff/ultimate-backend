import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bloodTearsMiddleware } from '@graphqlcqrs/common/middlewares';
import { AppUtils } from '@graphqlcqrs/common/utils';
import { authSetup, setupSwagger } from '@graphqlcqrs/common/setup';
import { SwaggerModule } from '@nestjs/swagger';
import { setupGrpc } from '@graphqlcqrs/core';

// tslint:disable-next-line:no-var-requires
const config = require('config-yml').load(process.env.NODE_ENV);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    preflightContinue: true,
  });
  app.enableShutdownHooks();
  app.use(bloodTearsMiddleware);
  AppUtils.killAppWithGrace(app);
  authSetup(app);

  const document = SwaggerModule.createDocument(app, setupSwagger());
  SwaggerModule.setup('api', app, document);

  await app.listenAsync(
    parseInt(process.env.PORT, 10) ||
    parseInt(config.services?.tenant?.port, 10) ||
    9200,
  );

  await setupGrpc(app, 'tenant', 'tenant.proto', config.services?.tenant?.grpcPort || 7200);
}

bootstrap();
