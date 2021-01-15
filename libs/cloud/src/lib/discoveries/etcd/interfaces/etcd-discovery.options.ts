import { DiscoveryOptions } from '../../../interfaces';

export interface EtcdDiscoveryOptions extends DiscoveryOptions {
  scheme: string;

  failFast?: boolean;
}
