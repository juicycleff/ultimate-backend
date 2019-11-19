import { Module } from '@nestjs/common';
import * as path from 'path';
import { buildContext } from 'graphql-passport';
import { GraphqlDistributedModule } from 'nestjs-graphql-gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from '@graphqlcqrs/common';
import { MongoModule } from '@juicycleff/nest-multi-tenant';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';
import { NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { PlansModule } from './plans/plans.module';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

@Module({
  imports: [
    GraphqlDistributedModule.forRoot({
      typePaths: [path.join(process.cwd() + '/apps/service-payment/src', '/**/*.graphql')],
      introspection: true,
      playground: {
        workspaceName: 'GRAPHQL SERVICE PAYMENT',
        settings: {
          'editor.theme': 'light',
        },
      },
      context: ({ req, res }) => buildContext({ req, res }),
    }),
    CommonModule,
    MongoModule.forRoot({
      uri: `${AppConfig.services?.payment?.mongodb?.uri}${AppConfig.services?.payment?.mongodb?.name}`,
      dbName: AppConfig.services?.payment?.mongodb?.name,
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
    PlansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
