import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { TenantRepository } from '@graphqlcqrs/repository/repositories';
import { TenantEntity } from '@graphqlcqrs/repository/entities';
import { GetTenantsQuery } from '../../impl';

@QueryHandler(GetTenantsQuery)
export class GetTenantsHandler implements IQueryHandler<GetTenantsQuery> {
  constructor(
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(query: GetTenantsQuery): Promise<TenantEntity[]> {
    Logger.log(query, 'GetTenantsQuery'); // write here
    const { where } = query;

    if (!where) { throw Error('Missing get inputs'); }
    return await this.tenantRepository.find({ conditions: {...where} });
  }
}
