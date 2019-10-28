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
import { join } from 'path';

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
    UserModule,
    AuthPayloadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
