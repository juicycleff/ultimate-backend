import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppUtils, setupSwagger, bloodTearsMiddleware } from '@graphqlcqrs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.use(bloodTearsMiddleware);

  const document = SwaggerModule.createDocument(app, setupSwagger());
  SwaggerModule.setup('api', app, document);
  AppUtils.killAppWithGrace(app);

  await app.listen(parseInt(process.env.PORT, 10) || 6600);
}
bootstrap();
