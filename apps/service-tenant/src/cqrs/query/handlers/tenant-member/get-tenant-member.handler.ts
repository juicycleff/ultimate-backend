import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { TenantMemberEmbed, TenantRepository } from '@graphqlcqrs/repository';
import { GetTenantMemberQuery } from '../../impl';

@QueryHandler(GetTenantMemberQuery)
export class GetTenantMemberHandler implements IQueryHandler<GetTenantMemberQuery> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(query: GetTenantMemberQuery): Promise<TenantMemberEmbed> {
    this.logger.log(`'Async '${query.constructor.name}...`);
    const { where, tenantId } = query;
    try {
      const tenant = await this.tenantRepository.aggregate([
        {
          $match: {
            $and: [
              {normalizedName: tenantId},
              {
                $or: [
                  {'members.id': where.id },
                  {'members.email': where.email },
                ],
              },
            ],
          },
        }, {
          $project: {
            members: 1,
            _id: 0,
          },
        },
      ]);
      return tenant.members;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
