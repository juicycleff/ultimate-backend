import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ApolloError } from 'apollo-server-express';
import { TenantRepository } from '@ultimatebackend/repository/repositories';
import { GetTenantsQuery } from '../../impl';
import { ObjectId } from 'mongodb';
import { mongoParser } from '@juicycleff/repo-orm';
import {
  FindTenantResponse,
  Tenant,
} from '@ultimatebackend/proto-schema/tenant';

@QueryHandler(GetTenantsQuery)
export class GetTenantsHandler implements IQueryHandler<GetTenantsQuery> {
  logger = new Logger(this.constructor.name);

  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(query: GetTenantsQuery): Promise<FindTenantResponse> {
    this.logger.log(`Async ${query.constructor.name}`);
    const { where, user, inApp } = query;

    try {
      if (!user) {
        throw new ApolloError('Missing get current user');
      }
      const filter = mongoParser(where);

      const userCond = {
        members: {
          $elemMatch: {
            $or: [
              { userId: new ObjectId(user && user.id) },
              { userId: user.id },
            ],
          },
        },
      };

      const userFilter = inApp ? {} : userCond;
      const tenants = await this.tenantRepository.find({
        conditions: { ...filter, ...userFilter },
      });

      return {
        tenants: (tenants as unknown) as Tenant[],
      };
    } catch (e) {
      this.logger.error(e);
      throw new ApolloError(e);
    }
  }
}
