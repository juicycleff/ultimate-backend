import { Module } from '@nestjs/common';
import { buildContext } from 'graphql-passport';
import { CommonModule } from '@graphqlcqrs/common';
import { GraphqlDistributedModule } from 'nestjs-graphql-gateway';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongoModule } from '@juicycleff/nest-multi-tenant';
import { AuthPayloadModule } from './auth-payload/auth-payload.module';
import { NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';
import { AuthPayload, User } from './types';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

@Module({
  imports: [
    CqrsModule,
    GraphqlDistributedModule.forRoot({
      autoSchemaFile: 'graphs/user.gql',
      buildSchemaOptions: {
        orphanedTypes: [AuthPayload, User],
      },
      playground: {
        workspaceName: 'GRAPHQL SERVICE USER',
        settings: {
          'editor.theme': 'light',
        },
      },
      context: ({ req, res }) => buildContext({ req, res }),
    }),
    CommonModule,
    MongoModule.forRoot({
      uri: `${AppConfig.services?.auth?.mongodb?.uri}${AppConfig.services?.auth?.mongodb?.name}`,
      dbName: AppConfig.services?.auth?.mongodb?.name,
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
    UserModule,
    AuthPayloadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
