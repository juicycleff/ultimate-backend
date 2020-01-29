import { Module } from '@nestjs/common';
import { TenantMemberResolver } from './tenant-member.resolver';
import { CookieSerializer } from '@graphqlcqrs/common';
import { TenantRepository } from '@graphqlcqrs/repository';
import { TenantMemberEventHandlers } from '@graphqlcqrs/core';
import { TenantMemberCommandHandlers, TenantMemberQueryHandlers } from '../cqrs';

@Module({
  providers: [
    TenantMemberResolver,
    TenantRepository,
    CookieSerializer,
    ...TenantMemberCommandHandlers,
    ...TenantMemberEventHandlers,
    ...TenantMemberQueryHandlers,
  ],
})
export class TenantMemberModule {}
