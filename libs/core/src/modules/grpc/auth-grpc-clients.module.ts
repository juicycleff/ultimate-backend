import { Module } from '@nestjs/common';
import { TenantGuardService } from '@graphqlcqrs/core';

@Module({
  providers: [TenantGuardService],
  exports: [TenantGuardService],
})
export class AuthGrpcClientsModule {}
