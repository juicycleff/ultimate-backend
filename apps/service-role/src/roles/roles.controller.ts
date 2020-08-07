import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  AddPolicyRequest,
  AddPolicyResponse,
  AddTenantRolesRequest,
  AddTenantRolesResponse,
  AddUserToRoleRequest,
  AddUserToRoleResponse,
  CreateRoleRequest,
  CreateRoleResponse,
  HasRightsRequest,
  HasRightsResponse,
  ReadRoleRequest,
  ReadRoleResponse,
  ReadUserRolesRequest,
  ReadUserRolesResponse,
  RemoveUserFromRoleRequest,
  RemoveUserFromRoleResponse,
  RoleService,
} from '@ultimatebackend/proto-schema/role';
import { NestCasbinService } from 'nestjs-casbin';
import { BadRequestError } from '@ultimatebackend/common';

@Controller()
export class RolesController implements RoleService<any> {
  logger = new Logger(this.constructor.name);

  constructor(private readonly casbinService: NestCasbinService) {
    // this.casbinService.enableAutoSave(true);
    // this.casbinService.enableLog(true);
    // this.casbinService.enableAutoBuildRoleLinks(true);
  }

  @GrpcMethod('RoleService')
  async hasRights(
    req: HasRightsRequest,
    metadata: any,
  ): Promise<HasRightsResponse> {
    const rsp: HasRightsResponse = { access: false };

    try {
      const dom = '*';
      let result = await this.casbinService.enforcer.enforceWithSyncCompile(
        dom,
        req.sub,
        req.res,
        req.act,
      );

      if (result) {
        rsp.access = result;
      } else if (req.dom.length > 0) {
        result = await this.casbinService.enforcer.enforceWithSyncCompile(
          req.dom,
          req.sub,
          req.res,
          req.act,
        );
        rsp.access = result;

        return rsp;
      }

      return rsp;
    } catch (e) {
      this.logger.error(e);
      rsp.access = false;
      return rsp;
    }
  }

  @GrpcMethod('RoleService')
  async readUserRoles(
    req: ReadUserRolesRequest,
    metadata: Map<string, any>,
  ): Promise<ReadUserRolesResponse> {
    if (req.userId.length < 1) {
      throw new BadRequestError('User ID missing');
    }

    let domain = '*';
    if (req.tenant.length > 0) {
      domain = req.tenant;
    }

    const ud = `${domain}::${req.userId}`;
    try {
      const roles = await this.casbinService.getRolesForUser(ud);
      return {
        roles,
      };
    } catch (e) {
      return {
        roles: [],
      };
    }
  }

  @GrpcMethod('RoleService')
  async addUserToRole(
    req: AddUserToRoleRequest,
    metadata: Map<string, any>,
  ): Promise<AddUserToRoleResponse> {
    const rsp: AddUserToRoleResponse = { roles: [] };
    try {
      const boolRes = await this.casbinService.addRoleForUser(
        `${req.domain}::${req.userId}`,
        req.role,
      );
      if (!boolRes) {
        throw new Error('There was an error');
      } else {
        rsp.roles = await this.casbinService.getRolesForUser(
          req.userId,
          req.domain,
        );
        return rsp;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  @GrpcMethod('RoleService')
  addTenantRoles(
    request: AddTenantRolesRequest,
    ctx: any,
  ): Promise<AddTenantRolesResponse> {
    return undefined;
  }

  @GrpcMethod('RoleService')
  createRole(
    request: CreateRoleRequest,
    ctx: any,
  ): Promise<CreateRoleResponse> {
    return undefined;
  }

  @GrpcMethod('RoleService')
  readRole(request: ReadRoleRequest, ctx: any): Promise<ReadRoleResponse> {
    return undefined;
  }

  @GrpcMethod('RoleService')
  async removeUserFromRole(
    request: RemoveUserFromRoleRequest,
    ctx: any,
  ): Promise<RemoveUserFromRoleResponse> {
    try {
      await this.casbinService.deleteUser(
        `${request.tenantId}::${request.userId}`,
      );
      return {
        success: true,
      };
    } catch (e) {
      throw new RpcException(e);
    }
  }

  @GrpcMethod('RoleService')
  async addPolicy(
    request: AddPolicyRequest,
    ctx: any,
  ): Promise<AddPolicyResponse> {
    const check = await this.casbinService.hasPolicy(...request.params);
    if (!check) {
      await this.casbinService.addPolicy(...request.params);
    }

    return {
      success: true,
    };
  }
}
