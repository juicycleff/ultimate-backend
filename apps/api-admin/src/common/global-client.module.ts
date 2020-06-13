import { Global, Module } from '@nestjs/common';
import { AccessTokenRpcClientService, GlobalClientService, RolesRpcClientService, TenantsRpcClientService } from '@ultimatebackend/core';

@Global()
@Module({
  providers: [RolesRpcClientService, AccessTokenRpcClientService, TenantsRpcClientService, GlobalClientService],
  exports: [RolesRpcClientService, AccessTokenRpcClientService, TenantsRpcClientService, GlobalClientService],
})
export class GlobalClientModule {}
