import { Module } from '@nestjs/common';
import { buildContext } from 'graphql-passport';
import { GraphqlDistributedModule } from 'nestjs-graphql-gateway/build/main';
import { MongoModule } from '@juicycleff/nest-multi-tenant';
import { BaseModule, CoreModule } from '@graphqlcqrs/core';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';
import { TenantModule } from './tenant/tenant.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantMemberModule } from './tenant-member/tenant-member.module';
import { Tenant, User, TenantMember } from './types';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

const jestMongoDb = global.__MONGO_URI__ ? `${global.__MONGO_URI__}/${global.__MONGO_DB_NAME__}` : undefined;

@Module({
  imports: [
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
    CoreModule,
    MongoModule.forRoot({
      uri: jestMongoDb || `${AppConfig.services?.auth?.mongodb?.uri}${AppConfig.services?.auth?.mongodb?.name}`,
      dbName: global.__MONGO_DB_NAME__ || AppConfig.services?.auth?.mongodb?.name,
    }),
    TenantModule,
    TenantMemberModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule extends BaseModule {}
