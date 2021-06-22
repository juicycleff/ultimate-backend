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
 * File name:         service.store.ts
 * Last modified:     11/03/2021, 14:13
 ******************************************************************************/
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { IServiceStore } from '../../interfaces';
import { ServiceStatus } from '../../constants/service-status.constants';
import { ServiceInstance } from '../service-instance';
import { EventEmitter } from 'events';

@Injectable()
export class ServiceStore
  extends EventEmitter
  implements IServiceStore, OnModuleDestroy {
  private readonly services: Map<string, ServiceInstance[]> = new Map();
  private eventName = 'change';
  logger = new Logger(ServiceStore.name);

  getServiceNames(): string[] {
    const names: string[] = [];
    for (const key of this.services.keys()) {
      if (this.services.has(key)) {
        names.push(key);
      }
    }
    return names;
  }

  getServiceNodes(name: string, passing?: boolean): ServiceInstance[] {
    const nodes = this.services.get(name) || [];
    if (passing) {
      return nodes.filter((node) => node.getStatus() === ServiceStatus.PASSING);
    }
    return nodes;
  }

  getServices(): Map<string, ServiceInstance[]> {
    return this.services;
  }

  addService(name: string, service: ServiceInstance, noEmit?: boolean) {
    if (this.services.has(name)) {
      const idx = this.services
        .get(name)
        .findIndex((elem) => elem.getServiceId() === service.getServiceId());
      if (idx !== -1) {
        this.services.get(name)[idx] = service;
      } else {
        this.services.get(name).push(service);
      }
    } else {
      this.services.set(name, [service]);
    }

    if (noEmit) return;
    this.emit(this.eventName, 'added', name, [service]);
  }

  addServices(name: string, services: ServiceInstance[]): void {
    if (this.services.has(name)) {
      for (const service of services) {
        this.addService(name, service, true);
      }
    } else {
      this.services.set(name, services);
    }
    this.emit(this.eventName, 'added', name, services);
  }

  setServices(name: string, services: ServiceInstance[]): void {
    this.services.set(name, services || []);
    this.emit(this.eventName, 'added', name, services);
  }

  removeService(name: string): void {
    if (this.services.has(name)) {
      this.emit(this.eventName, 'removed', name, this.services.get(name));
      this.services.delete(name);
    }
  }

  removeServiceNode(serviceName: string, nodeId: string): void {
    try {
      if (this.services.has(serviceName)) {
        if (this.services.get(serviceName).length === 1) {
          this.emit(
            this.eventName,
            'removed',
            serviceName,
            this.services.get(serviceName)
          );
          this.services.delete(serviceName);
        } else {
          const idx = this.services
            .get(serviceName)
            .findIndex((elem) => elem.getServiceId() === nodeId);
          if (idx !== -1) {
            const service = this.services.get(serviceName).splice(idx, 1);
            this.emit(this.eventName, 'removed', serviceName, [service]);
          }
        }
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  resetStore() {
    this.services.clear();
  }

  close(): void {
    this.removeAllListeners(this.eventName);
  }

  watch(
    callback: (
      type: 'added' | 'removed',
      name: string,
      service: ServiceInstance[]
    ) => void
  ): void {
    this.on(this.eventName, callback);
  }

  onModuleDestroy() {
    this.close();
  }
}
