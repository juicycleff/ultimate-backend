import { Module } from '@nestjs/common';
import { buildContext } from 'graphql-passport';
import { GraphqlDistributedModule } from 'nestjs-graphql-gateway';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    GraphqlDistributedModule.forRoot({
      typePaths: [path.join(process.cwd() + '/apps/service-user/src', '/**/*.graphql')],
      introspection: true,
      playground: {
        workspaceName: 'GRAPHQL SERVICE USER',
        settings: {
          'editor.theme': 'light',
        },
      },
      context: ({ req, res }) => buildContext({ req, res }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
