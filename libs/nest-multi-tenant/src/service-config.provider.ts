import { ValueProvider } from '@nestjs/common/interfaces';
import { TENANT_SERVICE_CONFIG_KEY } from './tenant.constant';
import { ITenantServiceConfig } from './interfaces';

export function serviceConfigProvider(config: ITenantServiceConfig): ValueProvider {
  return {
    provide: TENANT_SERVICE_CONFIG_KEY,
    useValue: config,
  };
}
