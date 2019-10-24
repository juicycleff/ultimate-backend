import { ApolloGateway } from '@apollo/gateway';
import { DynamicModule, Inject, Module, OnModuleInit, Optional } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ApolloServer } from 'apollo-server-express';

import { IDistributedGatewayOptions } from './interfaces';
import { DISTRIBUTED_GATEWAY_OPTIONS } from './tokens';

@Module({})
export class GraphqlDistributedGatewayModule implements OnModuleInit {

  public static forRoot(options: IDistributedGatewayOptions): DynamicModule {
    return {
      module: GraphqlDistributedGatewayModule,
      providers: [
        {
          provide: DISTRIBUTED_GATEWAY_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
  private apolloServer: ApolloServer | undefined;

  constructor(
    @Optional()
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(DISTRIBUTED_GATEWAY_OPTIONS)
    private readonly options: IDistributedGatewayOptions,
  ) {}

  public async onModuleInit() {
    if (!this.httpAdapterHost) { return; }
    const { httpAdapter } = this.httpAdapterHost;

    if (!httpAdapter) { return; }

    const app = httpAdapter.getInstance();
    const {
      options: {
        __exposeQueryPlanExperimental,
        debug,
        // @ts-ignore
        serviceList,
        path,
        disableHealthCheck,
        onHealthCheck,
        cors,
        bodyParserConfig,
        installSubscriptionHandlers,
        buildService,
        ...rest
      },
    } = this;

    const gateway = new ApolloGateway({
      __exposeQueryPlanExperimental,
      debug,
      serviceList,
      buildService,
    });

    this.apolloServer = new ApolloServer({
      gateway,
      ...rest,
    });

    this.apolloServer.applyMiddleware({
      app,
      path,
      disableHealthCheck,
      onHealthCheck,
      cors,
      bodyParserConfig,
    });

    if (installSubscriptionHandlers) {
      this.apolloServer.installSubscriptionHandlers(
        httpAdapter.getHttpServer(),
      );
    }
  }
}
