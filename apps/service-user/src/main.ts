import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppUtils, setupSwagger, bloodTearsMiddleware, authSetup } from '@graphqlcqrs/common';
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
    parseInt(config.services?.user?.port, 10) ||
    9000,
  );
  await app.startAllMicroservicesAsync();
}
bootstrap();
