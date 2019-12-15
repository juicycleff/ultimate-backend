import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {ApolloError} from 'apollo-server-express';
import { TenantRepository } from '@graphqlcqrs/repository/repositories';
import { TenantEntity } from '@graphqlcqrs/repository/entities';
import { GetTenantsQuery } from '../../impl';
import { ObjectId } from 'bson';
import { mongoParser } from '@ultimatebackend/contracts/utils';

@QueryHandler(GetTenantsQuery)
export class GetTenantsHandler implements IQueryHandler<GetTenantsQuery> {
  constructor(
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(query: GetTenantsQuery): Promise<TenantEntity[]> {
    Logger.log(query, 'GetTenantsQuery'); // write here
    const { where, user } = query;

    try {

      if (!user) { throw new ApolloError('Missing get current user'); }
      const filter = mongoParser(where);
      const userCond = {
        ownerId: new ObjectId(user && user.id),
      };

      const userFilter = user ? userCond : {};
      return await this.tenantRepository.find({ conditions: {...filter, ...userFilter} });
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
