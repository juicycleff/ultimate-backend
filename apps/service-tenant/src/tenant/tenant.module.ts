import { Module } from '@nestjs/common';
import { TenantResolver } from './tenant.resolver';

@Module({
  providers: [
    TenantResolver,
  ],
})
export class TenantModule {}
