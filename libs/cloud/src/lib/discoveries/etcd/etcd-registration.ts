import { Registration } from '../../interfaces';

export class EtcdRegistration implements Registration {
  getHost(): string {
    return '';
  }

  getInstanceId(): string {
    return '';
  }

  getMetadata(): Map<string, string> {
    return undefined;
  }

  getPort(): number {
    return 0;
  }

  getScheme(): string {
    return '';
  }

  getServiceId(): string {
    return '';
  }

  getUri(): string {
    return '';
  }

  isSecure(): boolean {
    return false;
  }
}
