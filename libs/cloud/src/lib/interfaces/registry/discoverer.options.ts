import { ConsulDiscoveryOptions } from '../../discoveries';
import { HeartbeatOptions } from './heartbeat.interface';
import { Service } from './service-registry.builder';
import { MdnsDiscoveryOptions } from '../../discoveries/mdns/interfaces';

export interface ConsulRegistryProviderOptions {
  discoverer: 'consul';
  service: Service;
  discovery?: ConsulDiscoveryOptions;
  heartbeat?: HeartbeatOptions;
}

export type LocalRegistryProviderOptions = {
  discoverer: 'local';
  service: Service;
  discovery?: MdnsDiscoveryOptions;
  heartbeat?: HeartbeatOptions;
};
