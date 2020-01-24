import { Module } from '@nestjs/common';
import { buildContext } from 'graphql-passport';
import { GraphqlDistributedModule } from 'nestjs-graphql-gateway';
import { MongoModule, MultiTenantModule, MultiTenantService } from '@juicycleff/nest-multi-tenant';
import { CoreModule } from '@graphqlcqrs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

@Module({
  imports: [
    GraphqlDistributedModule.forRoot({
      autoSchemaFile: 'graphs/project.gql',
      introspection: true,
      playground: {
        workspaceName: 'GRAPHQL SERVICE PROJECT',
        settings: {
          'editor.theme': 'light',
        },
      },
      context: ({ req, res }) => buildContext({ req, res }),
    }),
    CoreModule,
    /**
     * NOTICE: Scoped Request is not yet supported by CQRS hence commands and query will fail. Working to fix it in NestJS
     * Using forRootAsync will disable CQRS.
     */
    MongoModule.forRootAsync({
      config: {
        serviceName: 'service-project',
        dbUri: global.__MONGO_URI__ || AppConfig.services?.project?.mongodb?.uri,
        dbName: global.__MONGO_DB_NAME__ || AppConfig.services?.project?.mongodb?.name,
        dbReplicaOptions: AppConfig.services?.project?.mongodb?.options,
      },
      imports: [MultiTenantModule],
      useClass: MultiTenantService,
    }),
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
