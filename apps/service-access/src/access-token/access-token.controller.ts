import { Controller } from '@nestjs/common';
import {
  AccessService,
  CreateAccessRequest,
  CreateAccessResponse,
  DeleteAccessRequest,
  DeleteAccessResponse,
  FindAccessRequest,
  FindAccessResponse,
  HasRightsRequest,
  HasRightsResponse,
  ReadAccessRequest,
  ReadAccessResponse,
} from '@ultimatebackend/proto-schema/access';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccessCommand, DeleteAccessCommand, FindAccessQuery, HasRightsQuery, ReadAccessQuery } from './cqrs';
import { getIdentityFromCtx } from '@ultimatebackend/core';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('access-token')
export class AccessTokenController implements AccessService<any> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('AccessService')
  async createAccess(request: CreateAccessRequest, ctx: any): Promise<CreateAccessResponse> {
    const { user } = getIdentityFromCtx(ctx);
    return await this.commandBus.execute(new CreateAccessCommand(request, user));
  }

  @GrpcMethod('AccessService')
  async deleteAccess(request: DeleteAccessRequest, ctx: any): Promise<DeleteAccessResponse> {
    const { tenant } = getIdentityFromCtx(ctx);
    return await this.commandBus.execute(new DeleteAccessCommand(request, tenant.id.toString()));
  }

  @GrpcMethod('AccessService')
  async findAccess(request: FindAccessRequest, ctx: any): Promise<FindAccessResponse> {
    const { tenant } = getIdentityFromCtx(ctx);
    return await this.queryBus.execute(new FindAccessQuery({id: request.id, tenantId: tenant.id.toString()}));
  }

  @GrpcMethod('AccessService')
  async hasRights(request: HasRightsRequest, ctx: any): Promise<HasRightsResponse> {
    return await this.queryBus.execute(new HasRightsQuery(request));
  }

  @GrpcMethod('AccessService')
  async readAccess(request: ReadAccessRequest, ctx: any): Promise<ReadAccessResponse> {
    const { tenant } = getIdentityFromCtx(ctx);
    return await this.queryBus.execute(new ReadAccessQuery({id: request.id, tenantId: tenant.id.toString()}));
  }
}
