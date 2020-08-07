import { HttpModule, Module } from '@nestjs/common';
import { TenantsResolver } from './tenants.resolver';
import { TenantsMutationResolver } from './tenants-mutation.resolver';

@Module({
  imports: [HttpModule],
  providers: [TenantsResolver, TenantsMutationResolver],
})
export class TenantsModule {}
