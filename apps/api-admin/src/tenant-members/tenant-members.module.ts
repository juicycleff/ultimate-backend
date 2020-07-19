import { HttpModule, Module } from '@nestjs/common';
import { TenantMembersResolver } from './tenant-members.resolver';
import { TenantMembersMutationResolver } from './tenant-members-mutation.resolver';
import { AccountsRpcClientService, GlobalClientService, TenantsRpcClientService } from '@ultimatebackend/core';

@Module({
  imports: [HttpModule],
  providers: [
    GlobalClientService,
    TenantMembersResolver,
    TenantMembersMutationResolver,
    TenantsRpcClientService,
    AccountsRpcClientService,
  ],
})
export class TenantMembersModule {}
