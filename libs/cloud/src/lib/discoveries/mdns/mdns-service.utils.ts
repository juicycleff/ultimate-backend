/*******************************************************************************
 * Copyright (c) 2021. Rex Isaac Raphael
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * File name:         mdns-service.utils.ts
 * Last modified:     13/03/2021, 23:34
 ******************************************************************************/
import { RemoteService } from 'bonjour';
import { DefaultServiceInstance, ServiceInstance } from '@ultimate-backend/common';

export function mdnsToServicesInstance(services: RemoteService[]): ServiceInstance[] {
  const instances: ServiceInstance[] = [];

  for (const service of services) {
    instances.push(mdnsToServiceInstance(service));
  }

  return instances;
}


export function mdnsToServiceInstance(service: RemoteService): ServiceInstance {
  return new DefaultServiceInstance({
    nodeID: service.fqdn,
    port: service.port,
    instanceId: service.txt.serviceid,
    status: service.txt.status,
    metadata: service.txt,
    host: service.txt.host,
    secure: Boolean(service.txt.secure),
    serviceId: service.name,
  });
}
