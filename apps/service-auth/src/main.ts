import { NestFactory } from '@nestjs/core';
import { bloodTearsMiddleware } from '@graphqlcqrs/common/middlewares';
import { SwaggerModule } from '@nestjs/swagger';
import { authSetup, setupSwagger } from '@graphqlcqrs/common/setup';
import { AppUtils } from '@graphqlcqrs/common/utils';
import { AppModule } from './app.module';
import { setupGrpc } from '@graphqlcqrs/core';

// tslint:disable-next-line:no-var-requires
const config = require('config-yml').load(process.env.NODE_ENV);

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
  });
  app.use(bloodTearsMiddleware);
  AppUtils.killAppWithGrace(app);
  authSetup(app);

  const document = SwaggerModule.createDocument(app, setupSwagger());
  SwaggerModule.setup('api', app, document);

  await app.listenAsync(
    parseInt(process.env.PORT, 10) ||
    parseInt(config.services?.auth?.port,10) ||
    9900,
  );

  await setupGrpc(app, 'role', 'role.proto',config.services?.auth?.grpcPort || 7900);
}
bootstrap();
