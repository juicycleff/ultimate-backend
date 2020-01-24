import { Module } from '@nestjs/common';
import { buildContext } from 'graphql-passport';
import { GraphqlDistributedModule } from 'nestjs-graphql-gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongoModule } from '@juicycleff/nest-multi-tenant';
import { AuthPayloadModule } from './auth-payload/auth-payload.module';
import { AuthPayload, User } from './types';
import { CoreModule } from '@graphqlcqrs/core';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

const jestMongoDb = global.__MONGO_URI__ ? `${global.__MONGO_URI__}/${global.__MONGO_DB_NAME__}` : undefined;

@Module({
  imports: [
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
    CoreModule,
    MongoModule.forRoot({
      uri: jestMongoDb || `${AppConfig.services?.auth?.mongodb?.uri}${AppConfig.services?.auth?.mongodb?.name}`,
      dbName: global.__MONGO_DB_NAME__ || AppConfig.services?.auth?.mongodb?.name,
    }),
    UserModule,
    AuthPayloadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
