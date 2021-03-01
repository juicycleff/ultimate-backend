import { ServiceInstance } from './service-instance';

export class DefaultServiceInstance implements ServiceInstance {
  /**
   *
   *
   * @param instanceId the id of the instance.
   * @param serviceId the id of the service.
   * @param host the host where the service instance can be found.
   * @param port the port on which the service is running.
   * @param secure indicates whether or not the connection needs to be secure.
   * @param metadata optional a map containing metadata.
   */
  constructor(
    private instanceId: string,
    private serviceId: string,
    private host: string,
    private port: number,
    private secure: boolean,
    private metadata?: Map<string, string>
  ) {}

  getInstanceId(): string {
    return this.instanceId;
  }

  getServiceId(): string {
    return this.serviceId;
  }

  getHost(): string {
    return this.host;
  }

  getPort(): number {
    return this.port;
  }

  isSecure(): boolean {
    return this.secure;
  }

  getUri(): string {
    const scheme = this.getScheme();

    return `${scheme}://${this.getHost()}:${this.getPort()}`;
  }

  getScheme(): string {
    return this.isSecure() ? 'https' : 'http';
  }

  getMetadata(): Map<string, string> {
    return this.metadata || new Map();
  }
}
