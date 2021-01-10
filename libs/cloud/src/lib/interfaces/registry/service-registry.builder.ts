import { DiscoveryOptions, HeartbeatOptions, Registration, ServiceRegistration } from '../index';

export interface ServiceRegistryBuilder {
  heartbeatOptions(options: HeartbeatOptions): ServiceRegistryBuilder;

  /*registrationBuilder(builder: RegistrationBuilder): ServiceRegistryBuilder*/

  build(): ServiceRegistration<Registration>;
}

export interface RegistrationBuilder {
  serviceName(name: string): RegistrationBuilder;

  instanceId(id: string): RegistrationBuilder;

  host(host: string): RegistrationBuilder;

  port(port: number): RegistrationBuilder;

  discoveryOptions(options: DiscoveryOptions): RegistrationBuilder;

  heartbeatOptions(options: HeartbeatOptions): RegistrationBuilder;

  build(): Registration;
}
