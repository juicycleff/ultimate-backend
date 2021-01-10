import { DynamicModule, Global, Module } from '@nestjs/common';
import { UBCloudAsyncOptions, UBCloudOptions } from './interfaces';
import { C_REGISTRY_CLIENT, C_REGISTRY_CONFIG } from './constants';
import { validateOptions } from './utils';
import { initConsulProviders } from './discoveries/consul/utils';
import { ConsulServiceRegistry } from './discoveries';

@Global()
@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class UBCloudCoreModule {
  static forRoot(options: UBCloudOptions): DynamicModule {
    const registryOption = validateOptions(options.registry);

    const sharedProviders =  [];
    let mainClient;

    if (registryOption.discoverer === 'consul') {
      const { discoveryClient } = initConsulProviders(registryOption);
      mainClient = discoveryClient;
    }

    const clientProvider = {
      provide: C_REGISTRY_CLIENT,
      useValue: mainClient
    };
    const configProvider = {
      provide: C_REGISTRY_CONFIG,
      useValue: options.registry,
    };

    sharedProviders.push(...[configProvider, clientProvider]);
    if (registryOption.discoverer === 'consul') {
      sharedProviders.push(ConsulServiceRegistry);
    }

    return {
      module: UBCloudCoreModule,
      providers: sharedProviders,
      exports: sharedProviders,
    };
  }

  static forRootAsync(options: UBCloudAsyncOptions): DynamicModule {
    return null
  }
}
