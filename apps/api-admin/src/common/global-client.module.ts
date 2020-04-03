import { Global, Module } from '@nestjs/common';
import { AccessTokenRpcClientService, GlobalClientService, RolesRpcClientService } from '@ultimatebackend/core';

@Global()
@Module({
  providers: [RolesRpcClientService, AccessTokenRpcClientService, GlobalClientService],
  exports: [RolesRpcClientService, AccessTokenRpcClientService, GlobalClientService],
})
export class GlobalClientModule {}
