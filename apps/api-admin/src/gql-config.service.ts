import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { RedisCache } from 'apollo-server-cache-redis';
import { corsApollOptions } from '@ultimatebackend/common';
import { buildContext } from 'graphql-passport';
import { ConsulConfig, InjectConfig } from '@nestcloud/config';
import {
  AccessTokenRpcClientService,
  AccountsRpcClientService,
  BillingsRpcClientService,
  GqlContext,
  RolesRpcClientService,
  TenantsRpcClientService,
  WebhooksRpcClientService,
} from '@ultimatebackend/core';
import { RedisOptions } from 'ioredis';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(
    @InjectConfig() private readonly config: ConsulConfig,
    private readonly tenant: TenantsRpcClientService,
    private readonly account: AccountsRpcClientService,
    private readonly accessToken: AccessTokenRpcClientService,
    private readonly role: RolesRpcClientService,
    private readonly billing: BillingsRpcClientService,
    private readonly webhook: WebhooksRpcClientService,
  ) {}

  createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    /* Get redis config from consul */
    const redisOptions = this.config.get<RedisOptions>('database.redis');
    console.log(redisOptions);

    /* initialize cache */
    const cache = new RedisCache(redisOptions);
    return {
      autoSchemaFile: true,
      path: 'graph',
      cors: corsApollOptions,
      context: ({ req, res, payload, connection }): GqlContext => {
        const bc = buildContext({ req, res });

        return {
          // @ts-ignore
          payload,
          connection,
          ...bc,
          req: {
            ...req,
            ...bc.req,
          },
          rpc: {
            accessToken: this.accessToken,
            account: this.account,
            billing: this.billing,
            role: this.role,
            webhook: this.webhook,
            tenant: this.tenant,
          },
        };
      },
      cache,

      /**
       * Enable this at your own detriment. Without this, namespaced mutation won't work,
       * I have taken time to make sure resolvers guards are place in the right places.
       * While extending the application, be careful
       * Here is the reason https://github.com/nestjs/graphql/issues/295
       */
      fieldResolverEnhancers: ['guards', 'interceptors'],
      persistedQueries: {
        cache,
      },
      playground: {
        workspaceName: 'Admin Gateway',
        settings: {
          'editor.theme': 'light',
          'request.credentials': 'same-origin',
        },
      },
    };
  }
}
