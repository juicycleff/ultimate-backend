import * as NewService from '../../discoveries/consul/consul-interfaces';
import { ConsulDiscoveryOptions, ConsulOptions } from '../../discoveries';
import { HeartbeatOptions } from './heartbeat.interface';

export interface ConsulRegistryProviderOptions {
  discoverer: 'consul';
  service: NewService.Service;
  discovery?: ConsulDiscoveryOptions;
  client?: ConsulOptions;
  heartbeat?: HeartbeatOptions;
}

export type LocalRegistryProviderOptions = {
  discoverer: 'local';
  heartbeat?: HeartbeatOptions;
};
