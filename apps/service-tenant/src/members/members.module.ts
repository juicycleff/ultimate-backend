import { Module } from '@nestjs/common';
import { TenantRepository } from '@ultimatebackend/repository';
import { CookieSerializer } from '@ultimatebackend/common';
import { MemberCommandHandlers, MemberQueryHandlers } from './cqrs';
import {
  JwtConfigService,
  MemberEventHandlers,
  RolesRpcClientService,
} from '@ultimatebackend/core';
import { JwtModule } from '@nestjs/jwt';
import { MembersController } from './members.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  providers: [
    TenantRepository,
    RolesRpcClientService,
    CookieSerializer,
    ...MemberCommandHandlers,
    ...MemberEventHandlers,
    ...MemberQueryHandlers,
  ],
  controllers: [MembersController],
})
export class MembersModule {}
