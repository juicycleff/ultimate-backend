import { Module } from '@nestjs/common';
import { buildContext } from 'graphql-passport';
import { GraphqlDistributedModule } from 'nestjs-graphql-gateway/build/main';
import { CommonModule } from '@graphqlcqrs/common';
import { MongoModule } from '@juicycleff/nest-multi-tenant';
import { NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { CqrsModule } from '@nestjs/cqrs';
import { TenantModule } from './tenant/tenant.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';
import { TenantMemberModule } from './tenant-member/tenant-member.module';
import { Tenant, User } from './types';
import { TenantMember } from './types/tenant-member.type';

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
  providers: [AppService],
})
export class AppModule {}
