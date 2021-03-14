import { PlainObject, Registration } from '@ultimate-backend/common';
import { Service } from '../consul.interface';
import { ConsulDiscoveryOptions } from './consul-discovery.options';

export class ConsulRegistration implements Registration<Service> {
  private newService: Service;
  private discoveryOptions: ConsulDiscoveryOptions;

  constructor(newService: Service, discoveryOptions: ConsulDiscoveryOptions) {
    this.newService = newService;
    this.discoveryOptions = discoveryOptions;
  }

  getService(): Service {
    return this.newService;
  }

  getInstanceId(): string {
    return this.newService.id || '';
  }

  getServiceId(): string {
    return this.newService.name;
  }

  getHost(): string {
    return this.newService.address || '';
  }

  getPort(): number {
    return this.newService.port || 0;
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

  getMetadata(): PlainObject {
    return this.newService.meta || {};
  }

  getNodeID(): string {
    return '';
  }

  getStatus(): string {
    return this.newService.status || '';
  }

  getTags(): string[] {
    return this.newService.tags || [];
  }
}
