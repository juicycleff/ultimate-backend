import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {ApolloError} from 'apollo-server-express';
import { TenantRepository } from '@graphqlcqrs/repository/repositories';
import { TenantEntity } from '@graphqlcqrs/repository/entities';
import { GetTenantsQuery } from '../../impl';
import { ObjectId } from 'bson';

@QueryHandler(GetTenantsQuery)
export class GetTenantsHandler implements IQueryHandler<GetTenantsQuery> {
  constructor(
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(query: GetTenantsQuery): Promise<TenantEntity[]> {
    Logger.log(query, 'GetTenantsQuery'); // write here
    const { where, user } = query;

    if (!user) { throw Error('Missing get current user'); }

    try {
      return await this.tenantRepository.find({ conditions: {...where, ownerId: new ObjectId(user.id)} });
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
