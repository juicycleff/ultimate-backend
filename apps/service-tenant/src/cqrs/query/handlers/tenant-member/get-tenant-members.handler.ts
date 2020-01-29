import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { TenantMemberEmbed, TenantRepository } from '@graphqlcqrs/repository';
import { GetTenantMembersQuery } from '../../impl';
import { mongoParser } from '@juicycleff/nest-multi-tenant';

@QueryHandler(GetTenantMembersQuery)
export class GetTenantMembersHandler implements IQueryHandler<GetTenantMembersQuery> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(query: GetTenantMembersQuery): Promise<TenantMemberEmbed[]> {
    this.logger.log(`'Async '${query.constructor.name}...`);
    const { input, tenantId } = query;

    try {
      let tenant;
      if (input.where) {
        const filter = mongoParser(input.where);
        tenant = await this.tenantRepository.aggregate([
          {
            $match: {
              $and: [
                {normalizedName: tenantId},
                {
                  members: {
                    $elemMatch: filter,
                  },
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

        if (!tenant) { return []; }

        tenant = await tenant.next();
        return (tenant?.members ?? []);
      }

      tenant = await this.tenantRepository.findOne({
        normalizedName: tenantId,
      });
      return tenant.members;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
