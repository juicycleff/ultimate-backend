import { NestFactory } from '@nestjs/core';
import { bloodTearsMiddleware } from '@graphqlcqrs/common/middlewares';
import { enableMultiTenancy } from '@juicycleff/nest-multi-tenant/middleware';
import { TenantDatabaseStrategy } from '@juicycleff/nest-multi-tenant/tenant.enum';
import { authSetup, AppUtils, securitySetup, corsOptions } from '@graphqlcqrs/common';
import { AppModule } from './app.module';

// tslint:disable-next-line:no-var-requires
const config = require('config-yml').load(process.env.NODE_ENV);

async function bootstrapNest() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsOptions);
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
  authSetup(app, false);
  securitySetup(app);

  await app.listenAsync(
    parseInt(process.env.PORT, 10) ||
    parseInt(config.gateway?.admin?.port, 10) ||
    4000,
  );
}

bootstrapNest();
