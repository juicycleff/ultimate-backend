import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { TenantRepository } from '@graphqlcqrs/repository/repositories';
import { TenantEntity } from '@graphqlcqrs/repository/entities';
import { ObjectId } from 'bson';
import { GetTenantQuery } from '../../impl';
import { mongoParser } from '@juicycleff/nest-multi-tenant';
import { ApolloError } from 'apollo-server-express';

@QueryHandler(GetTenantQuery)
export class GetTenantHandler implements IQueryHandler<GetTenantQuery> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(query: GetTenantQuery): Promise<TenantEntity> {
    this.logger.log(`Async ${query.constructor.name}`); // write here
    const { where, user } = query;

    try {
      if (!where) { throw Error('Missing where inputs'); }
      const filter = mongoParser(where);
      const userCond = {
        ownerId: new ObjectId(user && user.id),
      };

      const userFilter = user ? userCond : {};

      return await this.tenantRepository.findOne({...filter, ...userFilter });
    } catch (e) {
      this.logger.error(e);
      throw new ApolloError(e);
    }
  }
}
