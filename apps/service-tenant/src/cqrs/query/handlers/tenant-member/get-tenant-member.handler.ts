import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { TenantMemberEmbed } from '@graphqlcqrs/repository/entities';
import { GetTenantMemberQuery } from '../../impl';
import { TenantRepository } from '@graphqlcqrs/repository';

@QueryHandler(GetTenantMemberQuery)
export class GetTenantMemberHandler implements IQueryHandler<GetTenantMemberQuery> {
  constructor(
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(query: GetTenantMemberQuery): Promise<TenantMemberEmbed> {
    Logger.log(query, 'GetTenantMemberQuery'); // write here
    const { where } = query;

    if (!where) { throw Error('Missing get inputs'); }
    const tenant = await this.tenantRepository.findOne({  });
    return tenant.members.reduce(previousValue => previousValue.email === where.email && previousValue);
  }
}
