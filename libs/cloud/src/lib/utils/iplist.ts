import * as ip from 'ip';
import { RegistryConfiguration } from '../interfaces';

export class IpUtils {
  /**
   * Get the ip address.
   */
  static getIpAddress(): string {
    return ip.address();
  }
}

export function validateOptions(
  options: RegistryConfiguration
): RegistryConfiguration {
  if (options.heartbeat == null) {
    options.heartbeat = {
      ttlInSeconds: 30,
      enabled: true,
    };
  }

  if (options.discoverer === 'consul') {
    if (options.discovery == null) {
      options.discovery = {
        scheme: 'http',
        failFast: true,
      };
    }
  }

  return options;
}
