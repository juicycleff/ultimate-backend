import { Module } from '@nestjs/common';
import { buildContext } from 'graphql-passport';
import { GraphqlDistributedModule } from 'nestjs-graphql-gateway';
import { MongoModule, NestMultiTenantModule, NestMultiTenantService } from '@juicycleff/nest-multi-tenant';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';
import { APP_GUARD } from '@nestjs/core';
import { CoreModule, TenantGuard } from '@graphqlcqrs/core';

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
    MongoModule.forRootAsync({
      imports: [NestMultiTenantModule],
      useExisting: NestMultiTenantService,
    }),
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
    AppService,
  ],
})
export class AppModule {}
