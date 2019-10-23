import { Module } from '@nestjs/common';
import { GraphqlDistributedModule } from '@graphqlcqrs/graphql-gateway';
import * as path from 'path';
import { buildContext } from 'graphql-passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongoModule, NestMultiTenantService } from '@juicycleff/nest-multi-tenant';
import { CommonModule } from '@graphqlcqrs/common';

@Module({
  imports: [
    GraphqlDistributedModule.forRoot({
      typePaths: [path.join(process.cwd() + '/apps/service-auth/src', '/**/*.graphql')],
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
    MongoModule.forRootAsync({
      useExisting: NestMultiTenantService,
    }),
    CommonModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
