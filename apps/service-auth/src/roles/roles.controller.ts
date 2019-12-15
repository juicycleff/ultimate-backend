import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BooleanPayload } from '@ultimatebackend/contracts';
import { NestCasbinService } from 'nestjs-casbin-mongodb';

@Controller('RoleService')
export class RolesController {
  constructor(private readonly casbinService: NestCasbinService) {}

  @GrpcMethod('RoleService', 'CheckPermission')
  async checkPermission(data: { params: string[] }): Promise<BooleanPayload> {
    const success = await this.casbinService.checkPermission(...data.params);
    return {
      success,
    };
  }

  @GrpcMethod('RoleService', 'AddPolicy')
  async addPolicy(data: { params: string[] }): Promise<BooleanPayload> {
    if (await this.casbinService.hasPolicy(...data.params) === false) {
      await this.casbinService.addPolicy(...data.params);
    }
    return {
      success: true,
    };
  }
}
