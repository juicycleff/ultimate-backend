import { ConsulRegistryProviderOptions } from '../../interfaces';
import * as Consul from 'consul';
import { ConsulDiscoveryClient } from './consul-discovery-client';

export class ConsulUtils {
  static getMetadata(tags: string[]): Map<string, string> {
    const metadata = new Map<string, string>();

    for (const tag of tags) {
      const parts = tag.split('=');
      metadata.set(parts[0], parts[1]);
    }

    return metadata;
  }
}

export function initConsulProviders(options: ConsulRegistryProviderOptions):
  {
    client: Consul.Consul,
    discoveryClient: ConsulDiscoveryClient
  } {

  const client = Consul({
    host: options.client.host,
    port: `${options.client.port}`,
    promisify: true,
    secure: options.client.secure,
  });

  const discoveryClient = new ConsulDiscoveryClient(options.client);

  return {
    client,
    discoveryClient,
  }
}
