import { Module } from '@nestjs/common';
import * as path from 'path';
import { buildContext } from 'graphql-passport';
import { NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphqlDistributedModule } from 'nestjs-graphql-gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongoModule } from '@juicycleff/nest-multi-tenant';
import { CommonModule } from '@graphqlcqrs/common';
// import { join } from 'path';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

@Module({
  imports: [
    CqrsModule,
    GraphqlDistributedModule.forRoot({
      typePaths: [path.join(process.cwd() + '/apps/service-auth/src', '/**/*.graphql')],
      /* definitions: {
        path: join(process.cwd() + '/libs/contracts/', 'src/services/auth-contract.ts'),
        outputAs: 'class',
      }, */
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
    CommonModule,
    MongoModule.forRoot({
      uri: `${process.env.MONGO_DB_SERVER_URI}${process.env.MONGODB_DB_NAME}`,
      dbName: process.env.MONGODB_DB_NAME,
    }),
    NestjsEventStoreModule.forRoot({
      http: {
        port: parseInt(process.env.ES_HTTP_PORT, 10),
        protocol: process.env.ES_HTTP_PROTOCOL,
      },
      tcp: {
        credentials: {
          password: process.env.ES_TCP_PASSWORD,
          username: process.env.ES_TCP_USERNAME,
        },
        hostname: process.env.ES_TCP_HOSTNAME,
        port: parseInt(process.env.ES_TCP_PORT, 10),
        protocol: process.env.ES_TCP_PROTOCOL,
      },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
