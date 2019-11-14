import { Module } from '@nestjs/common';
import { TenantMemberResolver } from './tenant-member.resolver';

@Module({
  providers: [TenantMemberResolver],
})
export class TenantMemberModule {}
