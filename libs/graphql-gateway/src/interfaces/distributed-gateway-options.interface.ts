import { GatewayConfig, ServiceEndpointDefinition } from '@apollo/gateway';
import { GraphQLDataSource } from '@apollo/gateway/src/datasources/types';
import { GqlModuleOptions } from '@nestjs/graphql';
import { Omit } from '@nestjs/graphql/dist/interfaces/gql-module-options.interface';

// tslint:disable-next-line
export interface IDistributedGatewayOptions extends Pick<GqlModuleOptions, 'path' | 'disableHealthCheck' | 'onHealthCheck' | 'cors' | 'bodyParserConfig' | 'installSubscriptionHandlers'>, Omit<GatewayConfig, 'buildService'> {}

export type BuildService = (definition: ServiceEndpointDefinition) => GraphQLDataSource;
