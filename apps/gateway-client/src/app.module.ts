import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphqlDistributedGatewayModule } from 'nestjs-graphql-gateway';
import { HeadersDatasource } from '@graphqlcqrs/common/helpers/headers.datasource';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

@Module({
  imports: [
    CacheModule.register(),
    GraphqlDistributedGatewayModule.forRoot({
      subscriptions: false,
      path: '/',
      context: context => context,
      serviceList: [
        { name: 'project', url: process.env.PROJECT_ENDPOINT || 'http://localhost:9100/graphql' },
        // more services
      ],
      buildService({ url }) {
        return new HeadersDatasource({ url });
      },
      cors: {
        preflightContinue: true,
        credentials: true,
      },
      playground: {
        workspaceName: 'Admin Gateway',
        settings: {
          'editor.theme': 'light',
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
