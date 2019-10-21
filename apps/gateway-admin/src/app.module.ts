import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphqlDistributedGatewayModule } from '@graphqlcqrs/graphql-gateway';
import { HeadersDatasource } from './headers.datasource';

@Module({
  imports: [
    GraphqlDistributedGatewayModule.forRoot({
      subscriptions: false,
      path: '/graphql',
      context: context => context,
      serviceList: [
        { name: 'auth', url: 'http://localhost:9900/graphql' },
        { name: 'user', url: 'http://localhost:9000/graphql' },
        { name: 'project', url: 'http://localhost:9100/graphql' },
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
