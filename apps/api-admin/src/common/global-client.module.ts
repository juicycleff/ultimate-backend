import { Global, Module } from '@nestjs/common';
import {
  AccessTokenRpcClientService,
  GlobalClientService,
  RolesRpcClientService,
  TenantsRpcClientService,
  AccountsRpcClientService,
  BillingsRpcClientService,
  WebhooksRpcClientService,
} from '@ultimatebackend/core';

@Global()
@Module({
  providers: [
    RolesRpcClientService,
    AccessTokenRpcClientService,
    TenantsRpcClientService,
    GlobalClientService,
    AccountsRpcClientService,
    BillingsRpcClientService,
    WebhooksRpcClientService,
  ],
  exports: [
    RolesRpcClientService,
    AccessTokenRpcClientService,
    TenantsRpcClientService,
    GlobalClientService,
    AccountsRpcClientService,
    BillingsRpcClientService,
    WebhooksRpcClientService,
  ],
})
export class GlobalClientModule {}
