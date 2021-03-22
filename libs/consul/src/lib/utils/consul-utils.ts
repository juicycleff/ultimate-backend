import {
  PlainObject,
  ServiceInstance,
  ServiceStatus,
} from '@ultimate-backend/common';
import { ConsulServiceInstance } from '../../';

export class ConsulUtils {
  static getMetadata(tags: string[]): PlainObject {
    const metadata = {};

    for (const tag of tags) {
      const parts = tag.split('=');
      metadata[parts[0]] = parts[1];
    }

    return metadata;
  }
}

export function consulServiceToServiceInstance(
  nodes: any[]
): ServiceInstance[] {
  const serviceInstances: ConsulServiceInstance[] = [];
  for (const node of nodes) {
    let status = ServiceStatus.CRITICAL;
    if (node.Checks.length) {
      status = ServiceStatus.PASSING;
    }

    for (let i = 0; i < node.Checks.length; i++) {
      const check = node.Checks[i];

      if (check.Status === ServiceStatus.CRITICAL) {
        status = ServiceStatus.CRITICAL;
        break;
      } else if (check.Status === ServiceStatus.WARNING) {
        status = ServiceStatus.WARNING;
        break;
      }
    }

    serviceInstances.push(
      new ConsulServiceInstance({
        host: node.Service.Address,
        metadata: node.Service.Meta,
        instanceId: node.Service.ID,
        nodeID: node.Node.Node,
        port: node.Service.Port,
        status,
        secure: node.Service.Meta.Secure || false,
        serviceId: node.Service.Service,
        tags: node.Service.Tags,
      })
    );
  }

  return serviceInstances;
}
