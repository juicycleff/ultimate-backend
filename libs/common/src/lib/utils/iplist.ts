import * as ip from 'ip';

export class IpUtils {
  /**
   * Get the ip address.
   */
  static getIpAddress(): string {
    return ip.address();
  }
}
