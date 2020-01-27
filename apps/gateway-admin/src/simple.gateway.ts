import { bloodTearsMiddleware } from '@graphqlcqrs/common/middlewares';
import { enableMultiTenancy } from '@juicycleff/nest-multi-tenant/middleware';
import { TenantDatabaseStrategy } from '@juicycleff/nest-multi-tenant/tenant.enum';
import { authSetup, corsOptions, securitySetup } from '@graphqlcqrs/common';
import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway } from '@apollo/gateway';
import * as express from 'express';
import * as cors from 'cors';
import { HeadersDatasource } from '@graphqlcqrs/common/helpers/headers.datasource';

// tslint:disable-next-line:no-var-requires
const config = require('config-yml').load(process.env.NODE_ENV);

async function bootstrapSimple() {

  const gateway = new ApolloGateway({
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
  });

  const server = new ApolloServer({
    gateway,
    subscriptions: false,
    // path: '/graphql',
    context: context => context,
    playground: {
      workspaceName: 'Admin Gateway',
      settings: {
        'editor.theme': 'light',
        'request.credentials': 'same-origin',
      },
    },
  });
  const app = express();

  app.use(cors(corsOptions));

  app.use(bloodTearsMiddleware);
  app.use(enableMultiTenancy({
    enabled: true,
    tenantResolver: {
      resolverType: 'Header',
      headerKeys: {
        tenant: 'x-tenant-id',
        key: 'x-tenant-key',
        secret: 'x-tenant-secret',
      },
      requiresToken: true,
    },
    databaseStrategy: TenantDatabaseStrategy.Both,
  }));
  authSetup(app, false);
  securitySetup(app);

  server.applyMiddleware({ app });
  await app.listen({ port: parseInt(process.env.PORT, 10) || parseInt(config.gateway?.admin?.port, 10) || 4000 });
}

bootstrapSimple();
