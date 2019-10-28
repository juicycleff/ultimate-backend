import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppUtils, setupSwagger, bloodTearsMiddleware, authSetup } from '@graphqlcqrs/common';
import { AppModule } from './app.module';
import { join } from 'path';
import { Transport } from '@nestjs/common/enums/transport.enum';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

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

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, 'user/user.proto'),
    },
  });

  const document = SwaggerModule.createDocument(app, setupSwagger());
  SwaggerModule.setup('api', app, document);

  await app.listenAsync(parseInt(process.env.PORT, 10) || 9000);
  await app.startAllMicroservicesAsync();
}
bootstrap();
