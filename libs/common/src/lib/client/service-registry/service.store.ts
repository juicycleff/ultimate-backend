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
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { IServiceStore } from '@ultimate-backend/cloud';
import { ServiceInstance, ServiceStatus } from '@ultimate-backend/common';
import { EventEmitter } from 'events';

@Injectable()
export class ServiceStore
  extends EventEmitter
  implements IServiceStore, OnModuleDestroy {
  private readonly services: Map<string, ServiceInstance[]> = new Map();
  private eventName = 'change';

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

  addService(name: string, service: ServiceInstance) {
    if (this.services.has(name)) {
      this.services.get(name).push(service);
    } else {
      this.services.set(name, [service]);
    }
    this.emit(this.eventName, 'added', name, [service]);
  }

  addServices(name: string, services: ServiceInstance[]): void {
    if (this.services.has(name)) {
      this.services.get(name).concat(...services);
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
      this.emit(this.eventName, 'removed', name, [this.services.get(name)]);
      this.services.delete(name);
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
