import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TenantEntity } from '@graphqlcqrs/repository';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BooleanPayload } from '@ultimatebackend/contracts';
import { GetTenantQuery } from '../cqrs/query/impl/tenant';

@Controller('tenant')
export class TenantController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('TenantService', 'FindOneTenant')
  async findOneTenant(data: { normalizedName: string, key: string, secret: string }, metadata: any): Promise<TenantEntity> {
    return await this.queryBus.execute(new GetTenantQuery({
      normalizedName: {
        _EQ: data.normalizedName,
      },
      tokens: {
        key: {
          _EQ: data.key,
        },
        secret: {
          _EQ: data.secret,
        },
      },
    }, null)) as TenantEntity;
  }

  @GrpcMethod('TenantService', 'TenantExist')
  tenantExist(data: any, metadata: any): BooleanPayload {
    return {
      success: true,
    };
  }
}
