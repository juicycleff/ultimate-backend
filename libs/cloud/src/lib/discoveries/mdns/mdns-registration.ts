import { Registration, Service } from '../../interfaces';
import { ConsulDiscoveryOptions } from '../consul';

export class MdnsRegistration implements Registration {
  constructor(
    private service: Service,
    private discoveryOptions: ConsulDiscoveryOptions
  ) {}

  getService(): Service {
    return this.service;
  }

  getInstanceId(): string {
    return this.service.id || '';
  }

  getServiceId(): string {
    return this.service.name;
  }

  getHost(): string {
    return this.service.address || '';
  }

  getPort(): number {
    return this.service.port || 0;
  }

  isSecure(): boolean {
    return this.discoveryOptions.scheme === 'https';
  }

  getUri(): string {
    const scheme = this.getScheme();
    return `${scheme}://${this.getHost()}:${this.getPort()}`;
  }

  getScheme(): string {
    return this.discoveryOptions.scheme || 'http';
  }

  getMetadata(): Map<string, string> {
    return null;
  }
}
