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
 * File name:         scanner.ts
 * Last modified:     19/03/2021, 16:11
 ******************************************************************************/
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, NestContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import { Module } from '@nestjs/core/injector/module';

@Injectable()
export class Scanner implements OnModuleInit {
  private container: NestContainer;

  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit(): any {
    this.container = this.findContainer();
  }

  public findInjectable<T extends any>(metaType: Function): T | undefined {
    if (!metaType) {
      return undefined;
    }
    const modules = this.container.getModules().values();
    for (const module of modules) {
      const instanceWrapper = module.injectables.get(metaType.name);
      if (
        instanceWrapper &&
        module.injectables.has(metaType.name) &&
        instanceWrapper.metatype === metaType
      ) {
        const instanceWrapper: InstanceWrapper = module.injectables.get(
          metaType.name
        );
        if (instanceWrapper) {
          const instanceHost = instanceWrapper.getInstanceByContextId(
            STATIC_CONTEXT
          );
          if (instanceHost.isResolved && instanceHost.instance) {
            return instanceHost.instance;
          }
        }
      }
    }
  }

  public findProviderByName<T extends any>(name: string): T | undefined {
    const modules = this.container.getModules().values();
    for (const module of modules) {
      const instanceWrapper = module.providers.get(name);
      if (instanceWrapper && module.providers.has(name)) {
        const instanceWrapper: InstanceWrapper = module.providers.get(name);
        if (instanceWrapper) {
          const instanceHost = instanceWrapper.getInstanceByContextId(
            STATIC_CONTEXT
          );
          if (instanceHost.isResolved && instanceHost.instance) {
            return instanceHost.instance;
          }
        }
      }
    }
  }

  public findContainer(): NestContainer {
    const providers: InstanceWrapper[] = this.discoveryService.getProviders();
    if (providers.length === 0) {
      return;
    }
    const module = providers[0].host as any;
    return module.container;
  }

  public findContextModule(constructor: Function): Module {
    const className = constructor.name;
    if (!className) {
      return;
    }
    for (const [, module] of [...this.container.getModules().entries()]) {
      if (this.findProviderByClassName(module, className)) {
        return module;
      }
    }
    return;
  }

  public findContextModuleName(constructor: Function): string {
    const className = constructor.name;
    if (!className) {
      return '';
    }
    for (const [key, module] of [...this.container.getModules().entries()]) {
      if (this.findProviderByClassName(module, className)) {
        return key;
      }
    }
    return '';
  }

  public findInjectableInstance<T extends Record<string, any>>(
    context: string,
    metaTypeOrName: Function | string
  ): InstanceWrapper | undefined {
    const collection = this.container.getModules();
    const module = collection.get(context);
    if (!module) {
      return undefined;
    }
    const injectables = module.injectables;
    return injectables.get(
      typeof metaTypeOrName === 'string' ? metaTypeOrName : metaTypeOrName.name
    );
  }

  public findProviderInstance<T extends Record<string, any>>(
    context: string,
    metaTypeOrName: Function | string
  ): InstanceWrapper | undefined {
    const collection = this.container.getModules();
    const module = collection.get(context);
    if (!module) {
      return undefined;
    }
    const providers = module.providers;
    return providers.get(
      typeof metaTypeOrName === 'string' ? metaTypeOrName : metaTypeOrName.name
    );
  }

  public findProviderByClassName(module: Module, className: string): boolean {
    const { providers } = module;
    const hasProvider = [...providers.keys()].some(
      (provider) => provider === className
    );
    return hasProvider;
  }
}
