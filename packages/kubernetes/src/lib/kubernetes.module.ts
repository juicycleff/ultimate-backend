import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import {
  KubernetesModuleAsyncOptions,
  KubernetesModuleOptions,
  KubernetesModuleOptionsFactory,
} from './kubernetes-module.options';
import { KubernetesConfig } from './kubernetes.config';
import { KubernetesClient } from './kubernetes.client';
import {
  KUBERNETES_CONFIG_OPTIONS,
  KUBERNETES_MODULE_OPTIONS,
} from './kubernetes.constant';

@Global()
@Module({})
export class KubernetesModule {
  static forRoot(options?: KubernetesModuleOptions): DynamicModule {
    return {
      module: KubernetesModule,
      providers: [
        {
          provide: KUBERNETES_CONFIG_OPTIONS,
          useValue: options || {},
        },
        KubernetesConfig,
        KubernetesClient,
      ],
      exports: [KubernetesClient],
      global: options?.global || true,
    };
  }

  static forRootAsync(options: KubernetesModuleAsyncOptions) {
    const providers: Provider[] = [KubernetesClient];

    const configProvider: Provider = {
      provide: KUBERNETES_CONFIG_OPTIONS,
      useFactory: async (modOptions: KubernetesModuleOptions) => {
        return modOptions;
      },
      inject: [KUBERNETES_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: KubernetesModule,
      imports: options.imports,
      providers: [
        {
          provide: KUBERNETES_CONFIG_OPTIONS,
          useValue: options,
        },
        ...asyncProviders,
        ...providers,
        configProvider,
        KubernetesConfig,
        KubernetesClient,
      ],
      exports: providers,
      global: true,
    };
  }

  private static createAsyncProviders(
    options: KubernetesModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory || options.useExisting) {
      return [this.createAsyncOptionsProviders(options)];
    }

    const useClass = options.useExisting as Type<KubernetesModuleOptionsFactory>;

    return [
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProviders(
    options: KubernetesModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        useFactory: options.useFactory,
        inject: options.inject,
        provide: KUBERNETES_MODULE_OPTIONS,
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<KubernetesModuleOptionsFactory>,
    ];

    return {
      provide: KUBERNETES_MODULE_OPTIONS,
      useFactory: async (optionsFactory: KubernetesModuleOptionsFactory) =>
        await optionsFactory.createClientOptions(),
      inject,
    };
  }
}
