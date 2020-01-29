import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { TenantMemberEmbed, TenantRepository } from '@graphqlcqrs/repository';
import { GetTenantMemberQuery } from '../../impl';
import { mongoParser } from '@juicycleff/nest-multi-tenant';

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

      const filter = mongoParser(where);
      let tenant = await this.tenantRepository.aggregate([
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

      tenant = await tenant.next() as any;
      if (!tenant) { return null; }
      // @ts-ignore
      if (!Array.isArray(tenant) && tenant?.members.length <= 0) { return null; }

      // @ts-ignore
      // const tenantMember = queryJson.query(tenant?.members, filter);
      throw new Error('Work in progress');
    } catch (e) {
      this.logger.error(e);
    }
  }
}
