import { Module } from '@nestjs/common';
import { buildContext } from 'graphql-passport';
import { GraphqlDistributedModule } from 'nestjs-graphql-gateway/build/main';
import { CommonModule } from '@graphqlcqrs/common';
import { MongoModule } from '@juicycleff/nest-multi-tenant';
import { NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { CqrsModule } from '@nestjs/cqrs';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';
import { NestCasbinModule } from 'nestjs-casbin-mongodb';
import { resolve } from 'path';
import { BaseModule, BootstrapService } from '@graphqlcqrs/core';
import { TenantModule } from './tenant/tenant.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantMemberModule } from './tenant-member/tenant-member.module';
import { Tenant, User, TenantMember } from './types';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

@Module({
  imports: [
    CqrsModule,
    GraphqlDistributedModule.forRoot({
      autoSchemaFile: 'graphs/tenant.gql',
      buildSchemaOptions: {
        orphanedTypes: [Tenant, TenantMember, User],
      },
      introspection: true,
      playground: {
        workspaceName: 'GRAPHQL SERVICE TENANT',
        settings: {
          'editor.theme': 'light',
        },
      },
      context: ({ req, res }) => buildContext({ req, res }),
    }),
    CommonModule,
    MongoModule.forRoot({
      uri: `${AppConfig.services?.tenant?.mongodb?.uri}${AppConfig.services?.tenant?.mongodb?.name}`,
      dbName: AppConfig.services?.tenant?.mongodb?.name,
    }),
    NestCasbinModule.forRootAsync(
      AppConfig.casbin.dbUri,
      resolve('models/roles.conf'),
      AppConfig.casbin.dbName,
      'roles',
    ),
    NestjsEventStoreModule.forRoot({
      tcpEndpoint: {
        host: process.env.ES_TCP_HOSTNAME || AppConfig.eventstore?.hostname,
        port: parseInt(process.env.ES_TCP_PORT, 10) || AppConfig.eventstore?.tcpPort,
      },
      options: {
        defaultUserCredentials: {
          password: AppConfig.eventstore?.tcpPassword,
          username: AppConfig.eventstore?.tcpUsername,
        },
      },
    }),
    TenantModule,
    TenantMemberModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, BootstrapService],
})
export class AppModule extends BaseModule {}
