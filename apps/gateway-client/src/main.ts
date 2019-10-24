import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { bloodTearsMiddleware } from '@graphqlcqrs/common/middlewares';
import { enableMultiTenancy } from '@juicycleff/nest-multi-tenant/middleware';
import { TenantDatabaseStrategy, TenantResolverType } from '@juicycleff/nest-multi-tenant/tenant.enum';
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
    resolverType: TenantResolverType.Domain,
    databaseStrategy: TenantDatabaseStrategy.DataIsolation,
  }));
  AppUtils.killAppWithGrace(app);
  app.use(cookieParser());
  await app.listen(parseInt(process.env.PORT, 10) || 5000);
}
bootstrap();
