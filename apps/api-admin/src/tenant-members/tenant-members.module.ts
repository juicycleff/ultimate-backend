import { HttpModule, Module } from '@nestjs/common';
import { TenantMembersResolver } from './tenant-members.resolver';
import { TenantMembersMutationResolver } from './tenant-members-mutation.resolver';

@Module({
  imports: [HttpModule],
  providers: [TenantMembersResolver, TenantMembersMutationResolver],
})
export class TenantMembersModule {}
