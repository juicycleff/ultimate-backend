import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { bloodTearsMiddleware } from '@graphqlcqrs/common/middlewares';
import { enableMultiTenancy } from '@juicycleff/nest-multi-tenant/middleware';
import { TenantDatabaseStrategy } from '@juicycleff/nest-multi-tenant/tenant.enum';
import { AppUtils } from '@graphqlcqrs/common/utils';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
  });
  app.use(bloodTearsMiddleware);
  app.use(enableMultiTenancy({
    enabled: true,
    tenantResolver: {
      resolverType: 'Header',
      headerKeys: {
        tenant: 'x-tenant-id',
        key: 'x-tenant-key',
        secret: 'x-tenant-secret',
      },
      requiresToken: true,
    },
    databaseStrategy: TenantDatabaseStrategy.Both,
  }));
  AppUtils.killAppWithGrace(app);
  app.use(cookieParser());
  await app.listen(parseInt(process.env.PORT, 10) || 4000);
}

bootstrap();
