import { Module } from '@nestjs/common';
import { buildContext } from 'graphql-passport';
import { GraphqlDistributedModule } from 'nestjs-graphql-gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongoModule } from '@juicycleff/nest-multi-tenant';
import { RolesModule } from './roles/roles.module';
import { NestCasbinModule } from 'nestjs-casbin-mongodb';
import { resolve } from 'path';
import { CoreModule } from '@graphqlcqrs/core';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

const jestMongoDb = global.__MONGO_URI__ ? `${global.__MONGO_URI__}/${global.__MONGO_DB_NAME__}` : undefined;

@Module({
  imports: [
    CoreModule,
    GraphqlDistributedModule.forRoot({
      autoSchemaFile: 'graphs/auth.gql',
      playground: {
        workspaceName: 'GRAPHQL CQRS',
        settings: {
          'editor.theme': 'light',
          'request.credentials': 'same-origin',
        },
      },
      cors: {
        preflightContinue: true,
        credentials: true,
      },
      context: ({ req, res }) => buildContext({ req, res }),
    }),
    NestCasbinModule.forRootAsync(
      jestMongoDb || `${AppConfig.casbin?.dbUri}${AppConfig.casbin?.dbName}${AppConfig.mongodb?.options}`,
      resolve('models/roles.conf'),
      AppConfig.casbin.dbName,
      'roles',
      null,
    ),
    MongoModule.forRoot({
      uri: jestMongoDb || `${AppConfig.services?.auth?.mongodb?.uri}${AppConfig.services?.auth?.mongodb?.name}`,
      dbName: global.__MONGO_DB_NAME__ || AppConfig.services?.auth?.mongodb?.name,
    }),
    AuthModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
