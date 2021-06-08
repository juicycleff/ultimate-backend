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
 * File name:         bootstrap.discovery.ts
 * Last modified:     26/03/2021, 14:37
 ******************************************************************************/
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { BootstrapMetadataAccessor } from './bootstrap-metadata.accessor';
import { BootstrapOrchestrator } from './bootstrap.orchestrator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BootstrapDiscovery {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly bootstrapOrchestrator: BootstrapOrchestrator,
    private readonly metadataAccessor: BootstrapMetadataAccessor
  ) {}

  async onModuleInit() {
    this.discover();
    await this.bootstrapOrchestrator.mountConfigValues();
  }

  discover() {
    const providers: InstanceWrapper[] = [
      ...this.discoveryService.getProviders(),
      ...this.discoveryService.getControllers(),
    ];
    providers.forEach((wrapper: InstanceWrapper) => {
      const { instance } = wrapper;
      if (!instance || typeof instance === 'string') {
        return;
      }
      this.lookupWatchers(instance);
    });
  }

  lookupWatchers(instance: Function) {
    const configValues = this.metadataAccessor.getBootValues(instance);
    if (configValues) {
      this.bootstrapOrchestrator.addConfigValues(instance, configValues);
    }
  }
}
