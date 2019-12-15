import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { TenantRepository } from '@graphqlcqrs/repository/repositories';
import { TenantEntity } from '@graphqlcqrs/repository/entities';
import { ObjectId } from 'bson';
import { GetTenantQuery } from '../../impl';
import { mongoParser } from '@ultimatebackend/contracts';

@QueryHandler(GetTenantQuery)
export class GetTenantHandler implements IQueryHandler<GetTenantQuery> {
  constructor(
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(query: GetTenantQuery): Promise<TenantEntity> {
    Logger.log(query, 'GetTenantQuery'); // write here
    const { where, user } = query;

    if (!where) { throw Error('Missing where inputs'); }
    const filter = mongoParser(where);
    const userCond = {
      ownerId: new ObjectId(user && user.id),
    };

    const userFilter = user ? userCond : {};

    return await this.tenantRepository.findOne({...filter, ...userFilter });
  }
}
