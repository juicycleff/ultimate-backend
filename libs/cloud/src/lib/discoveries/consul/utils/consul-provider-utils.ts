import { ConsulRegistryProviderOptions } from '../../../interfaces';
import * as Consul from 'consul';
import { ConsulDiscoveryClient } from '../consul-discovery-client';

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
