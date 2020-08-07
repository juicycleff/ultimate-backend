import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TenantRepository } from '@ultimatebackend/repository';
import { GetMembersQuery } from '../../impl';
import {
  FindMemberResponse,
  Member,
} from '@ultimatebackend/proto-schema/tenant';
import { BadRequestRpcException } from '@ultimatebackend/common';

@QueryHandler(GetMembersQuery)
export class GetMembersHandler implements IQueryHandler<GetMembersQuery> {
  logger = new Logger(this.constructor.name);

  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(query: GetMembersQuery): Promise<FindMemberResponse> {
    this.logger.log(`'Async '${query.constructor.name}...`);
    const { input, tenantId } = query;

    const normalizedName = input?.tenantId ?? tenantId;
    try {
      if (normalizedName === undefined || normalizedName === null) {
        throw new BadRequestRpcException('Tenant id missing');
      }

      const tenant = await this.tenantRepository.findOne(
        {
          normalizedName,
        },
        false,
      );

      let members = tenant.members;

      if (input.role !== undefined && input.role !== null) {
        members = members.filter((m) => m.role === input.role);
      }

      if (input.status !== undefined && input.status !== null) {
        members = members.filter((m) => m.status === input.status);
      }

      return {
        members: (members as unknown) as Member[],
      };
    } catch (e) {
      this.logger.error(e);
    }
  }
}
