import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {ApolloError} from 'apollo-server-express';
import { TenantRepository } from '@graphqlcqrs/repository/repositories';
import { TenantEntity } from '@graphqlcqrs/repository/entities';
import { GetTenantsQuery } from '../../impl';
import { ObjectId } from 'bson';
import { mongoParser } from '@juicycleff/nest-multi-tenant';

@QueryHandler(GetTenantsQuery)
export class GetTenantsHandler implements IQueryHandler<GetTenantsQuery> {
  logger = new Logger(this.constructor.name); // write here
  constructor(
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(query: GetTenantsQuery): Promise<TenantEntity[]> {
    this.logger.log(`Async ${query.constructor.name}...`);

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
      this.logger.error(e);
      throw new ApolloError(e);
    }
  }
}
