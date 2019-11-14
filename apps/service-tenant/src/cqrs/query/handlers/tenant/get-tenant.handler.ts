import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { TenantRepository, UserRepository } from '@graphqlcqrs/repository/repositories';
import { TenantEntity, UserEntity } from '@graphqlcqrs/repository/entities';
import { GetTenantQuery } from '../../impl';

@QueryHandler(GetTenantQuery)
export class GetTenantHandler implements IQueryHandler<GetTenantQuery> {
  constructor(
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(query: GetTenantQuery): Promise<TenantEntity> {
    Logger.log(query, 'GetTenantQuery'); // write here
    const { where } = query;

    if (!where) { throw Error('Missing get inputs'); }
    return await this.tenantRepository.findOne({ ...where });
  }
}
