import { Registration } from './registration';
import { DiscoveryOptions } from './discovery.interface';
import { HeartbeatOptions } from './heartbeat.interface';
import { ServiceRegistry } from '@ultimate-backend/common';

export interface ServiceRegistryBuilder {
  heartbeatOptions(options: HeartbeatOptions): ServiceRegistryBuilder;

  build(): ServiceRegistry<Registration>;
}

export interface RegistrationBuilder {
  serviceName(name: string): RegistrationBuilder;

  instanceId(id: string): RegistrationBuilder;

  host(host: string): RegistrationBuilder;

  port(port: number): RegistrationBuilder;

  domain(domain: string): RegistrationBuilder;

  discoveryOptions(options: DiscoveryOptions): RegistrationBuilder;

  heartbeatOptions(options: HeartbeatOptions): RegistrationBuilder;

  build(): Registration;
}
