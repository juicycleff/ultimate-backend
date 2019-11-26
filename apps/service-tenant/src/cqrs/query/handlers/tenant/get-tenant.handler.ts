import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { TenantRepository } from '@graphqlcqrs/repository/repositories';
import { TenantEntity } from '@graphqlcqrs/repository/entities';
import { GetTenantQuery } from '../../impl';
import { ObjectId } from 'bson';

@QueryHandler(GetTenantQuery)
export class GetTenantHandler implements IQueryHandler<GetTenantQuery> {
  constructor(
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(query: GetTenantQuery): Promise<TenantEntity> {
    Logger.log(query, 'GetTenantQuery'); // write here
    const { where, user } = query;

    if (!where) { throw Error('Missing get inputs'); }
    return await this.tenantRepository.findOne({...where, ownerId: new ObjectId(user.id)});
  }
}
