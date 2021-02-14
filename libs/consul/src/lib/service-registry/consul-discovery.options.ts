import { DiscoveryOptions } from '@ultimate-backend/common';

export interface ConsulDiscoveryOptions extends DiscoveryOptions {
  scheme: string;

  failFast?: boolean;
}
