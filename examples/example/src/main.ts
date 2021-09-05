import { NestFactory } from '@nestjs/core';
import { UBServiceFactory } from '@ultimate-backend/core';

import { AppModule } from './app/app.module';

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await UBServiceFactory.create(app)
    .withSwagger()
    .withGrpc()
    .withPoweredBy()
    .withMultiTenancy()
    .withPrefix('api')
    .start(parseInt(process.env.PORT, 10) || 3332);
}

bootstrap();
