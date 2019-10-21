import { Module } from '@nestjs/common';
import { GraphqlDistributedModule } from '@graphqlcqrs/graphql-gateway';
import * as path from 'path';
import { buildContext } from 'graphql-passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongoModule } from '@juicycleff/nest-multi-tenant/database';
import { NestMultiTenantService } from '@juicycleff/nest-multi-tenant/nest-multi-tenant.service';
import { NestMultiTenantModule } from '@juicycleff/nest-multi-tenant/nest-multi-tenant.module';
import { RepositoryModule } from '@graphqlcqrs/repository';

@Module({
  imports: [
    GraphqlDistributedModule.forRoot({
      typePaths: [path.join(process.cwd() + '/apps/service-auth/src', '/**/*.graphql')],
      introspection: true,
      playground: {
        workspaceName: 'GRAPHQL CQRS',
        settings: {
          'editor.theme': 'light',
        },
      },
      cors: {
        preflightContinue: true,
        credentials: true,
      },
      context: ({ req, res }) => buildContext({ req, res }),
    }),
    MongoModule.forRootAsync({
      useExisting: NestMultiTenantService,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
