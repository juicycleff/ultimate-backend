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
import {
  CreateAccessCommand,
  DeleteAccessCommand,
  FindAccessQuery,
  HasRightsQuery,
  ReadAccessQuery,
} from './cqrs';
import { getIdentityFromCtx } from '@ultimatebackend/core';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('webhook')
export class AccessTokenController implements AccessService<any> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('AccessService')
  async createAccess(
    request: CreateAccessRequest,
    ctx: any,
  ): Promise<CreateAccessResponse> {
    const { user, tenantInfo } = getIdentityFromCtx(ctx);
    return await this.commandBus.execute(
      new CreateAccessCommand(
        {
          ...request,
          tenantId: request.tenantId ?? tenantInfo.tenantId,
        },
        user,
      ),
    );
  }

  @GrpcMethod('AccessService')
  async deleteAccess(
    request: DeleteAccessRequest,
    ctx: any,
  ): Promise<DeleteAccessResponse> {
    const { tenantInfo } = getIdentityFromCtx(ctx);
    return await this.commandBus.execute(
      new DeleteAccessCommand(request, request.tenantId ?? tenantInfo.tenantId),
    );
  }

  @GrpcMethod('AccessService')
  async findAccess(
    request: FindAccessRequest,
    ctx: any,
  ): Promise<FindAccessResponse> {
    const { tenantInfo } = getIdentityFromCtx(ctx);
    return await this.queryBus.execute(
      new FindAccessQuery({
        filter: request?.filter,
        tenantId: request?.tenantId ?? tenantInfo.tenantId,
      }),
    );
  }

  @GrpcMethod('AccessService')
  async hasRights(
    request: HasRightsRequest,
    ctx: any,
  ): Promise<HasRightsResponse> {
    return await this.queryBus.execute(new HasRightsQuery(request));
  }

  @GrpcMethod('AccessService')
  async readAccess(
    request: ReadAccessRequest,
    ctx: any,
  ): Promise<ReadAccessResponse> {
    const { tenantInfo } = getIdentityFromCtx(ctx);
    return await this.queryBus.execute(
      new ReadAccessQuery({
        id: request.id,
        tenantId: request.tenantId ?? tenantInfo.tenantId,
      }),
    );
  }
}
