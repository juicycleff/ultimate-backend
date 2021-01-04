import { DiscoveryOptions } from '../../../interfaces';

export interface ConsulDiscoveryOptions extends DiscoveryOptions {
  scheme: string;

  failFast?: boolean;
}
