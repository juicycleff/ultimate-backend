import { Module } from '@nestjs/common';
import * as path from 'path';
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

@Module({
  imports: [
    CqrsModule,
    GraphqlDistributedModule.forRoot({
      typePaths: [path.join(process.cwd() + '/apps/service-project/src', '/**/*.graphql')],
      introspection: true,
      playground: {
        workspaceName: 'GRAPHQL SERVICE USER',
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
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
