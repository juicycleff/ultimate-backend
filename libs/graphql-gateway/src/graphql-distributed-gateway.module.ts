import { ApolloGateway } from '@apollo/gateway';
import { DynamicModule, Inject, Module, OnModuleInit, Optional } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ApolloServer } from 'apollo-server-express';

import { BuildService, IDistributedGatewayOptions } from './interfaces';
import { DISTRIBUTED_GATEWAY_BUILD_SERVICE, DISTRIBUTED_GATEWAY_OPTIONS } from './tokens';

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
    @Optional() @Inject(DISTRIBUTED_GATEWAY_BUILD_SERVICE)
    private readonly buildService: BuildService,
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
      },
      buildService,
    } = this;

    const gateway = new ApolloGateway({
      __exposeQueryPlanExperimental,
      debug,
      serviceList,
      buildService,
    });

    const { schema, executor } = await gateway.load();

    this.apolloServer = new ApolloServer({
      executor,
      schema,
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
