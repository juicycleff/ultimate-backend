import { buildFederatedSchema } from '@apollo/federation';
import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GraphQLAstExplorer } from '@nestjs/graphql';
import { GraphQLSchemaBuilder } from '@nestjs/graphql/dist/graphql-schema-builder';
import { DelegatesExplorerService } from '@nestjs/graphql/dist/services/delegates-explorer.service';
import { ResolversExplorerService } from '@nestjs/graphql/dist/services/resolvers-explorer.service';
import { ScalarsExplorerService } from '@nestjs/graphql/dist/services/scalars-explorer.service';
import { extend } from '@nestjs/graphql/dist/utils/extend.util';
import { removeTempField } from '@nestjs/graphql/dist/utils/remove-temp.util';
import { gql } from 'apollo-server-express';
import { ReferencesExplorerService } from './services';

@Injectable()
export class GraphqlDistributedFactory {
  constructor(
    private readonly resolversExplorerService: ResolversExplorerService,
    private readonly delegatesExplorerService: DelegatesExplorerService,
    private readonly scalarsExplorerService: ScalarsExplorerService,
    private readonly referencesExplorerService: ReferencesExplorerService,
    private readonly graphqlAstExplorer: GraphQLAstExplorer,
    private readonly gqlSchemaBuilder: GraphQLSchemaBuilder,
  ) {}

  // @ts-ignore
  public async mergeOptions(options: GqlModuleOptions = {}): Promise<GqlModuleOptions> {
    const resolvers = this.extendResolvers([
      this.resolversExplorerService.explore(),
      this.scalarsExplorerService.explore(),
      this.referencesExplorerService.explore(),
    ]);

    const federatedSchema = buildFederatedSchema([
      {
        typeDefs: gql`${options.typeDefs}`,
        resolvers,
      },
    ]);

    removeTempField(federatedSchema);
    return {
      ...options,
      typeDefs: undefined,
      schema: federatedSchema,
    };
  }

  private extendResolvers(resolvers: any[]) {
    // @ts-ignore
    return resolvers.reduce((prev, curr) => extend(prev, curr), {});
  }
}
