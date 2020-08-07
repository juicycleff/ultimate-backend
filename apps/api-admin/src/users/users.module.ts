import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersMutationResolver } from './users-mutation.resolver';
import { AccountsRpcClientService } from '@ultimatebackend/core';

@Module({
  providers: [AccountsRpcClientService, UsersResolver, UsersMutationResolver],
})
export class UsersModule {}
