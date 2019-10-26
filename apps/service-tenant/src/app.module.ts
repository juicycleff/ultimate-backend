import { Module } from '@nestjs/common';
import * as path from 'path';
import { buildContext } from 'graphql-passport';
import { GraphqlDistributedModule } from 'nestjs-graphql-gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    GraphqlDistributedModule.forRoot({
      typePaths: [path.join(process.cwd() + '/apps/service-tenant/src', '/**/*.graphql')],
      introspection: true,
      playground: {
        workspaceName: 'GRAPHQL SERVICE USER',
        settings: {
          'editor.theme': 'light',
        },
      },
      context: ({ req, res }) => buildContext({ req, res }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
