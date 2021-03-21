import * as ip from 'ip';
import * as os from 'os';

export class IpUtils {
  /**
   * Get the ip address.
   */
  static getIpAddress(): string {
    return ip.address();
  }
}

export function getIpList() {
  const list = [];
  const ilist = [];
  const interfaces = os.networkInterfaces();
  for (const iface in interfaces) {
    for (const i in interfaces[iface]) {
      const f = interfaces[iface][i];
      if (f.family === 'IPv4') {
        if (f.internal) {
          ilist.push(f.address);
          break;
        } else {
          list.push(f.address);
          break;
        }
      }
    }
  }
  return list.length > 0 ? list : ilist;
}
