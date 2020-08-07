import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMemberQuery } from '../../impl';
import { TenantRepository } from '@ultimatebackend/repository';
import {
  Member,
  ReadMemberResponse,
} from '@ultimatebackend/proto-schema/tenant';

@QueryHandler(GetMemberQuery)
export class GetMemberHandler implements IQueryHandler<GetMemberQuery> {
  logger = new Logger(this.constructor.name);

  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(query: GetMemberQuery): Promise<ReadMemberResponse> {
    this.logger.log(`'Async '${query.constructor.name}...`);
    const { where, tenantId } = query;
    try {
      const tenant = await this.tenantRepository.findOne({
        normalizedName: tenantId,
      });

      const member = tenant.members.reduce(
        (previousValue) => previousValue.id === where.id && previousValue,
      );
      return {
        member: (member as unknown) as Member,
      };
    } catch (e) {
      this.logger.error(e);
    }
  }
}
