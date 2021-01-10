import { DiscoveryOptions } from '../../../interfaces';

export interface KubernetesDiscoveryOptions extends DiscoveryOptions {
  scheme: string;

  failFast?: boolean;
}
