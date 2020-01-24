import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as useragent from 'express-useragent';
import { bloodTearsMiddleware } from '@graphqlcqrs/common/middlewares';
import { enableMultiTenancy } from '@juicycleff/nest-multi-tenant/middleware';
import { TenantDatabaseStrategy } from '@juicycleff/nest-multi-tenant/tenant.enum';
import { AppUtils } from '@graphqlcqrs/common/utils';
import { AppModule } from './app.module';
import { securitySetup } from '@graphqlcqrs/common/setup';

// tslint:disable-next-line:no-var-requires
const config = require('config-yml').load(process.env.NODE_ENV);

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
    databaseStrategy: TenantDatabaseStrategy.DataIsolation,
  }));
  AppUtils.killAppWithGrace(app);
  app.use(cookieParser());
  app.use(useragent.express());
  securitySetup(app);

  await app.listenAsync(
    parseInt(process.env.PORT, 10) ||
    parseInt(config.gateway?.client?.port, 10) ||
    5000,
  );
}
bootstrap();
