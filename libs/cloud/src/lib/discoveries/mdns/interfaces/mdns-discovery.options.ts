import { DiscoveryOptions } from '../../../interfaces';

export interface MdnsDiscoveryOptions extends DiscoveryOptions {
  scheme: string;

  failFast?: boolean;
}
