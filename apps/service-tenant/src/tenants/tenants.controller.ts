import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateTenantRequest,
  CreateTenantResponse,
  DeleteTenantRequest,
  DeleteTenantResponse,
  FindTenantRequest,
  FindTenantResponse,
  ReadTenantRequest,
  ReadTenantResponse,
  TenantAvailableRequest,
  TenantAvailableResponse,
  UpdateTenantRequest,
  UpdateTenantResponse,
} from '@ultimatebackend/proto-schema/tenant';
import {
  CreateTenantCommand,
  GetTenantQuery,
  GetTenantsQuery,
  RemoveTenantCommand,
  TenantAvailableQuery,
  UpdateTenantCommand,
} from './cqrs';
import { getIdentityFromCtx } from '@ultimatebackend/core';

@Controller('tenants')
export class TenantsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('TenantService')
  async createTenant(
    request: CreateTenantRequest,
    ctx: any,
  ): Promise<CreateTenantResponse> {
    const { user } = getIdentityFromCtx(ctx);
    return await this.commandBus.execute(
      new CreateTenantCommand(request, user),
    );
  }

  @GrpcMethod('TenantService')
  async deleteTenant(
    request: DeleteTenantRequest,
    ctx: any,
  ): Promise<DeleteTenantResponse> {
    const { user } = getIdentityFromCtx(ctx);
    return await this.commandBus.execute(
      new RemoveTenantCommand(request, user),
    );
  }

  @GrpcMethod('TenantService')
  async findTenant(
    request: FindTenantRequest,
    ctx: any,
  ): Promise<FindTenantResponse> {
    const { user, inApp } = getIdentityFromCtx(ctx);
    return await this.queryBus.execute(
      new GetTenantsQuery(request, user, inApp),
    );
  }

  @GrpcMethod('TenantService')
  async readTenant(
    request: ReadTenantRequest,
    ctx: any,
  ): Promise<ReadTenantResponse> {
    const { user, inApp } = getIdentityFromCtx(ctx);
    return await this.queryBus.execute(
      new GetTenantQuery(request, user, inApp),
    );
  }

  @GrpcMethod('TenantService')
  async tenantAvailable(
    request: TenantAvailableRequest,
    ctx: any,
  ): Promise<TenantAvailableResponse> {
    return await this.queryBus.execute(new TenantAvailableQuery(request));
  }

  @GrpcMethod('TenantService')
  async updateTenant(
    request: UpdateTenantRequest,
    ctx: any,
  ): Promise<UpdateTenantResponse> {
    const { user } = getIdentityFromCtx(ctx);
    return await this.commandBus.execute(
      new UpdateTenantCommand(request, user),
    );
  }
}
