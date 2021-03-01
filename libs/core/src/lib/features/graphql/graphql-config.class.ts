import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { AccountsRpcClientService } from '@livents/core/features/grpc';
import { ConsulConfig } from '@nestcloud/config/config.consul';
import { InjectConfig } from '@nestcloud/config';
import { buildContext } from 'graphql-passport';
import { GqlContext } from '@livents/core/interfaces';

@Injectable()
export class GraphqlConfigClass implements GqlOptionsFactory {
  constructor(
    @InjectConfig() private readonly config: ConsulConfig,
    private readonly account: AccountsRpcClientService
  ) {}

  createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      autoSchemaFile: true,
      path: 'graph',
      context: ({ req, res, payload, connection }): GqlContext => {
        const bc = buildContext({ req, res });

        return {
          payload,
          connection,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          req: {
            ...req,
            ...bc.req,
          },
          rpc: {
            account: this.account,
          },
          ...bc,
        };
      },

      /**
       * Enable this at your own detriment. Without this, namespaced mutation won't work,
       * I have taken time to make sure resolvers guards are place in the right places.
       * While extending the application, be careful
       * Here is the reason https://github.com/nestjs/graphql/issues/295
       */
      fieldResolverEnhancers: ['guards', 'interceptors'],
      tracing: true,
      playground: {
        workspaceName: 'API Gateway',
        endpoint: '/graph',
        subscriptionEndpoint: '/subscription',
        settings: {
          'editor.theme': 'dark',
          'request.credentials': 'same-origin',
        },
      },
    };
  }
}
