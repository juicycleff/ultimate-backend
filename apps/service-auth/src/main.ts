import { NestFactory } from '@nestjs/core';
import { bloodTearsMiddleware } from '@graphqlcqrs/common/middlewares';
import { SwaggerModule } from '@nestjs/swagger';
import { authSetup, setupSwagger } from '@graphqlcqrs/common/setup';
import { AppUtils } from '@graphqlcqrs/common/utils';
import { AppModule } from './app.module';
import { TenantDatabaseStrategy, TenantResolverType } from '@juicycleff/nest-multi-tenant/tenant.enum';
import { enableMultiTenancy } from '@juicycleff/nest-multi-tenant/middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bloodTearsMiddleware);
  app.use(enableMultiTenancy({
    enabled: true,
    resolverType: TenantResolverType.Domain,
    databaseStrategy: TenantDatabaseStrategy.DataIsolation,
  }));
  AppUtils.killAppWithGrace(app);
  authSetup(app);

  const document = SwaggerModule.createDocument(app, setupSwagger());
  SwaggerModule.setup('api', app, document);
  await app.listen(parseInt(process.env.PORT, 10) || 9900);
}
bootstrap();
