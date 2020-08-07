import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AcceptMemberInvitationRequest,
  AcceptMemberInvitationResponse,
  DeleteMemberRequest,
  DeleteMemberResponse,
  FindMemberRequest,
  FindMemberResponse,
  InviteMemberRequest,
  InviteMemberResponse,
  ReadMemberRequest,
  ReadMemberResponse,
  UpdateMemberRequest,
  UpdateMemberResponse,
} from '@ultimatebackend/proto-schema/tenant';
import { getIdentityFromCtx } from '@ultimatebackend/core';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  AcceptInvitationCommand,
  InviteMemberCommand,
  RemoveMemberCommand,
  UpdateMemberCommand,
} from './cqrs/command/impl/member';
import { GetMemberQuery, GetMembersQuery } from './cqrs/query/impl/member';

@Controller('members')
export class MembersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('TenantService')
  async acceptMemberInvitation(
    request: AcceptMemberInvitationRequest,
    ctx: any,
  ): Promise<AcceptMemberInvitationResponse> {
    const { user } = getIdentityFromCtx(ctx);
    return await this.commandBus.execute(
      new AcceptInvitationCommand(request, user),
    );
  }

  @GrpcMethod('TenantService')
  async deleteMember(
    request: DeleteMemberRequest,
    ctx: any,
  ): Promise<DeleteMemberResponse> {
    const { user, tenantInfo } = getIdentityFromCtx(ctx);
    return await this.commandBus.execute(
      new RemoveMemberCommand(request, tenantInfo.tenantId, user),
    );
  }

  @GrpcMethod('TenantService')
  async findMembers(
    request: FindMemberRequest,
    ctx: any,
  ): Promise<FindMemberResponse> {
    const { tenantInfo } = getIdentityFromCtx(ctx);
    return await this.queryBus.execute(
      new GetMembersQuery(request, tenantInfo?.tenantId),
    );
  }

  @GrpcMethod('TenantService')
  async inviteMember(
    request: InviteMemberRequest,
    ctx: any,
  ): Promise<InviteMemberResponse> {
    const { user, tenantInfo } = getIdentityFromCtx(ctx);
    return await this.commandBus.execute(
      new InviteMemberCommand(request, user, tenantInfo.tenantId),
    );
  }

  @GrpcMethod('TenantService')
  async readMember(
    request: ReadMemberRequest,
    ctx: any,
  ): Promise<ReadMemberResponse> {
    const { tenantInfo } = getIdentityFromCtx(ctx);
    return await this.queryBus.execute(
      new GetMemberQuery(request, tenantInfo.tenantId),
    );
  }

  @GrpcMethod('TenantService')
  async updateMember(
    request: UpdateMemberRequest,
    ctx: any,
  ): Promise<UpdateMemberResponse> {
    const { user, tenantInfo } = getIdentityFromCtx(ctx);
    return await this.commandBus.execute(
      new UpdateMemberCommand(request, tenantInfo.tenantId, user),
    );
  }
}
