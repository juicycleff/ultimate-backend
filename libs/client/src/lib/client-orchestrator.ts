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
 * File name:         client-orchestrator.ts
 * Last modified:     18/03/2021, 22:23
 ******************************************************************************/
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientOptions } from './interface';
import { LoadBalancerClient } from '@ultimate-backend/loadbalancer';
import { ClientMetadata } from './interface/client-metdata.interface';
import { ClientFactory } from './client.factory';
import { Brakes } from '@ultimate-backend/brakes';

interface Client {
  property: string;
  target: Function;
  options: ClientOptions;
}

@Injectable()
export class ClientOrchestrator implements OnApplicationBootstrap {
  private readonly clients = new Map<string, Client>();

  constructor(
    private readonly lb: LoadBalancerClient,
    private readonly brakes: Brakes
  ) {}

  public addClients(target: Function, clients: ClientMetadata[]) {
    clients.forEach(({ property, options }) => {
      const key = `${property}__${target.constructor.name}`;
      this.clients.set(key, { property, target, options });
    });
  }

  private async mountClients() {
    for (const item of this.clients.values()) {
      const { property, target, options } = item;

      Object.defineProperty(target, property, {
        get: () => {
          return ClientFactory.create(this.lb, this.brakes, options);
        },
      });
    }
  }

  async onApplicationBootstrap() {
    await this.mountClients();
  }
}
