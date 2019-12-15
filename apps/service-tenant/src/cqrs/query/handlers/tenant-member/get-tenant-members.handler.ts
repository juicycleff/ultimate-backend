import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { TenantMemberEmbed } from '@graphqlcqrs/repository/entities';
import { TenantRepository } from '@graphqlcqrs/repository';
import { GetTenantMembersQuery } from '../../impl';

@QueryHandler(GetTenantMembersQuery)
export class GetTenantMembersHandler implements IQueryHandler<GetTenantMembersQuery> {
  constructor(
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(query: GetTenantMembersQuery): Promise<TenantMemberEmbed[]> {
    Logger.log(query, 'GetUserQuery'); // write here
    const { where, tenantId } = query;

    if (!where) { throw Error('Missing get inputs'); }
    const tenant = await this.tenantRepository.aggregate([
      {
        $match: {
          $and: [
            {_id: tenantId},
            {
              $or: [
              {'members.id': where.id },
              {'members.email': where.email },
            ]},
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
  }
}
