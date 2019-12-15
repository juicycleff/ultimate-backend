import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppUtils, authSetup, bloodTearsMiddleware, setupSwagger } from '@graphqlcqrs/common';
import { setupGrpc } from '@graphqlcqrs/core';
import { AppModule } from './app.module';

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
    parseInt(config.services?.plan?.port,10) ||
    9500,
  );

  await setupGrpc(app, 'plan', 'plan.proto', config.services?.plan?.grpcPort || 7500);
}
bootstrap();
