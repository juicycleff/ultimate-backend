import { printSchema } from '@apollo/federation';
import { DynamicModule, Inject, Module, OnModuleInit, Optional, Provider } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import {
  GqlModuleAsyncOptions,
  GqlModuleOptions,
  GqlOptionsFactory,
  GraphQLAstExplorer,
  GraphQLFactory,
} from '@nestjs/graphql';
import { GraphQLSchemaBuilder } from '@nestjs/graphql/dist/graphql-schema-builder';
import { GRAPHQL_MODULE_ID, GRAPHQL_MODULE_OPTIONS } from '@nestjs/graphql/dist/graphql.constants';
import { DelegatesExplorerService } from '@nestjs/graphql/dist/services/delegates-explorer.service';
import { ResolversExplorerService } from '@nestjs/graphql/dist/services/resolvers-explorer.service';
import { ScalarsExplorerService } from '@nestjs/graphql/dist/services/scalars-explorer.service';
import { extend } from '@nestjs/graphql/dist/utils/extend.util';
import { generateString } from '@nestjs/graphql/dist/utils/generate-token.util';
import { mergeDefaults } from '@nestjs/graphql/dist/utils/merge-defaults.util';
import { ApolloServer } from 'apollo-server-express';

import { GraphqlDistributedFactory } from './graphql-distributed.factory';
import { GraphQLTypesLoader } from './graphql-types.loader';
import { ReferencesExplorerService } from './services';

@Module({
  providers: [
    GraphqlDistributedFactory,
    GraphQLFactory,
    MetadataScanner,
    ResolversExplorerService,
    DelegatesExplorerService,
    ScalarsExplorerService,
    ReferencesExplorerService,
    GraphQLAstExplorer,
    GraphQLTypesLoader,
    GraphQLSchemaBuilder,
  ],
  exports: [GraphQLTypesLoader, GraphQLAstExplorer],
})
export class GraphqlDistributedModule implements OnModuleInit {
  public static forRoot(options: GqlModuleOptions = {}): DynamicModule {
    options = mergeDefaults(options);
    return {
      module: GraphqlDistributedModule,
      providers: [
        {
          provide: GRAPHQL_MODULE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  public static forRootAsync(options: GqlModuleAsyncOptions): DynamicModule {
    return {
      module: GraphqlDistributedModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: GRAPHQL_MODULE_ID,
          useValue: generateString(),
        },
      ],
    };
  }

  private static createAsyncProviders(
    options: GqlModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      // @ts-ignore
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: GqlModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: GRAPHQL_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // @ts-ignore
    return {
      provide: GRAPHQL_MODULE_OPTIONS,
      useFactory: (optionsFactory: GqlOptionsFactory) => optionsFactory.createGqlOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }

  private apolloServer: ApolloServer | undefined;

  constructor(
    @Optional()
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(GRAPHQL_MODULE_OPTIONS)
    private readonly options: GqlModuleOptions,
    private readonly graphqlFactory: GraphQLFactory,
    private readonly graphqlDistributedFactory: GraphqlDistributedFactory,
    private readonly graphqlTypesLoader: GraphQLTypesLoader,
  ) {}

  public async onModuleInit() {
    if (!this.httpAdapterHost) {
      return;
    }
    const {httpAdapter} = this.httpAdapterHost;

    if (!httpAdapter) {
      return;
    }

    const {
      path,
      disableHealthCheck,
      onHealthCheck,
      cors,
      bodyParserConfig,
      typePaths,
    } = this.options;
    const app = httpAdapter.getInstance();

    // @ts-ignore
    const typeDefs = await this.graphqlTypesLoader.getTypesFromPaths(typePaths);

    const mergedTypeDefs = extend(typeDefs, this.options.typeDefs);
    const apolloOptions = await this.graphqlDistributedFactory.mergeOptions({
      ...this.options,
      typeDefs: mergedTypeDefs,
    });

    if (this.options.definitions && this.options.definitions.path) {
      await this.graphqlFactory.generateDefinitions(
        // @ts-ignore
        printSchema(apolloOptions.schema),
        this.options,
      );
    }

    this.apolloServer = new ApolloServer(apolloOptions as any);
    this.apolloServer.applyMiddleware({
      app,
      path,
      disableHealthCheck,
      onHealthCheck,
      cors,
      bodyParserConfig,
    });

    if (this.options.installSubscriptionHandlers) {
      // TL;DR <https://github.com/apollographql/apollo-server/issues/2776>
      throw new Error('No support for subscriptions yet');
      /*this.apolloServer.installSubscriptionHandlers(
        httpAdapter.getHttpServer(),
      );*/
    }
  }

}
