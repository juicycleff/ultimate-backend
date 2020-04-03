import { HttpModule, Module } from '@nestjs/common';
import { TenantsResolver } from './tenants.resolver';
import { TenantsMutationResolver } from './tenants-mutation.resolver';
import { TenantsRpcClientService } from '@ultimatebackend/core';

@Module({
  imports: [HttpModule],
  providers: [
    TenantsResolver,
    TenantsRpcClientService,
    TenantsMutationResolver,
  ],
})
export class TenantsModule {}
