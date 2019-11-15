import { Module } from '@nestjs/common';
import { buildContext } from 'graphql-passport';
import { GraphqlDistributedModule } from 'nestjs-graphql-gateway';
import { CommonModule } from '@graphqlcqrs/common';
import { MongoModule, NestMultiTenantModule, NestMultiTenantService } from '@juicycleff/nest-multi-tenant';
import { NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { CqrsModule } from '@nestjs/cqrs';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

@Module({
  imports: [
    CqrsModule,
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
    CommonModule,
    MongoModule.forRootAsync({
      imports: [NestMultiTenantModule],
      useExisting: NestMultiTenantService,
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
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
