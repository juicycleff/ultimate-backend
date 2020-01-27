import { CacheModule, Module } from '@nestjs/common';
import { GraphqlDistributedGatewayModule } from 'nestjs-graphql-gateway';
import { buildContext } from 'graphql-passport';
import { HeadersDatasource } from '@graphqlcqrs/common/helpers/headers.datasource';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CookieSerializer } from '@graphqlcqrs/common/providers';
import { BuilderUserStrategy } from './builder-user.strategy';
import { corsApollOptions } from '@graphqlcqrs/common/utils';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

@Module({
  imports: [
    CacheModule.register(),
    GraphqlDistributedGatewayModule.forRoot({
      subscriptions: false,
      path: '/graphql',
      context: ({ req, res }) => buildContext({ req, res }),
      serviceList: [
        { name: 'auth', url: process.env.AUTH_ENDPOINT || 'http://localhost:9900/graphql' },
        { name: 'user', url: process.env.USER_ENDPOINT || 'http://localhost:9000/graphql' },
        { name: 'project', url: process.env.PROJECT_ENDPOINT || 'http://localhost:9100/graphql' },
        { name: 'tenant', url: process.env.TENANT_ENDPOINT || 'http://localhost:9200/graphql' },
        { name: 'payment', url: process.env.PAYMENT_ENDPOINT || 'http://localhost:9500/graphql' },
        // more services
      ],
      buildService({ url }) {
        return new HeadersDatasource({ url });
      },
      cors: corsApollOptions,
      playground: {
        workspaceName: 'Admin Gateway',
        settings: {
          'editor.theme': 'light',
          'request.credentials': 'same-origin',
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, BuilderUserStrategy, CookieSerializer],
})
export class AppModule {}
