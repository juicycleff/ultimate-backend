import { Module } from '@nestjs/common';
import { buildContext } from 'graphql-passport';
import { CommonModule } from '@graphqlcqrs/common';
import { GraphqlDistributedModule } from 'nestjs-graphql-gateway';
import * as path from 'path';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongoModule } from '@juicycleff/nest-multi-tenant';
import { AuthPayloadModule } from './auth-payload/auth-payload.module';
import { NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';

@Module({
  imports: [
    CqrsModule,
    GraphqlDistributedModule.forRoot({
      typePaths: [path.join(process.cwd() + '/apps/service-user/src', '/**/*.graphql')],
      introspection: true,
      /* definitions: {
        path: join(process.cwd() + '/apps/service-user/', 'src/graphql.ts'),
        outputAs: 'class',
      }, */
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
      http: {
        port: parseInt(process.env.ES_HTTP_PORT, 10) || AppConfig.eventstore?.httpPort,
        protocol: parseInt(process.env.ES_HTTP_PROTOCOL, 10) || AppConfig.eventstore?.httpProtocol,
      },
      tcp: {
        credentials: {
          password: AppConfig.eventstore?.tcpPassword,
          username: AppConfig.eventstore?.tcpUsername,
        },
        hostname: process.env.ES_TCP_HOSTNAME || AppConfig.eventstore?.hostname,
        port: parseInt(process.env.ES_HTTP_PORT, 10) || AppConfig.eventstore?.tcpPort,
        protocol: AppConfig.eventstore?.tcpProtocol,
      },
    }),
    UserModule,
    AuthPayloadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
