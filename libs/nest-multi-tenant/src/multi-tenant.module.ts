import {
  DynamicModule,
  Module,
} from '@nestjs/common';
import { ITenantServiceConfig } from '@juicycleff/nest-multi-tenant/interfaces';
import { serviceConfigProvider } from '@juicycleff/nest-multi-tenant/service-config.provider';

@Module({})
export class MultiTenantModule {
  static forRoot(config: ITenantServiceConfig): DynamicModule {
    return {
      module: MultiTenantModule,
      providers: [
        serviceConfigProvider(config),
      ],
      exports: [
        serviceConfigProvider(config),
      ],
    };
  }
}
