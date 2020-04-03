import { Module } from '@nestjs/common';
import { AccessTokenResolver } from './access-token.resolver';
import { RolesRpcClientService } from '@ultimatebackend/core';
import { AccessTokenMutationResolver } from './access-token-mutation.resolver';

@Module({
  providers: [
    AccessTokenResolver,
    AccessTokenMutationResolver,
    RolesRpcClientService,
  ],
})
export class AccessTokenModule {}
