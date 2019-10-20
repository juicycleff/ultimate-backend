import { GatewayConfig } from '@apollo/gateway';
import { GqlModuleOptions } from '@nestjs/graphql';
import { Omit } from '@nestjs/graphql/dist/interfaces/gql-module-options.interface';

// tslint:disable-next-line
export interface IDistributedGatewayOptions extends Pick<GqlModuleOptions, 'path' | 'disableHealthCheck' | 'onHealthCheck' | 'cors' | 'bodyParserConfig' | 'installSubscriptionHandlers' | 'context' | 'subscriptions' | 'playground'>, Omit<GatewayConfig, ''>, IServiceList {}

interface IServiceList {
  serviceList: ServiceListItem[];
}

interface ServiceListItem {
 name: string;
 url: string;
}
