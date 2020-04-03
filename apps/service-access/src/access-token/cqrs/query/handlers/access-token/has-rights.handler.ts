import { CACHE_MANAGER, CacheStore, Inject, Logger } from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { HasRightsResponse } from '@ultimatebackend/proto-schema/access';
import { NestCasbinService } from 'nestjs-casbin';
import { RpcException } from '@nestjs/microservices';
import { HasRightsQuery } from '../../impl';

@QueryHandler(HasRightsQuery)
export class HasRightsHandler implements IQueryHandler<HasRightsQuery> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly accessEnforcer: NestCasbinService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async execute(query: HasRightsQuery): Promise<HasRightsResponse> {
    this.logger.log(`Async ${query.constructor.name}`); // write here
    const { input } = query;

    try {
      const cacheKey = 'service-access/has-rights/' + input.token + input.scope;
      const cacheData = await this.cacheStore.get<boolean>(cacheKey);
      if (cacheData !== undefined && typeof cacheData !== 'undefined') {
        return {
          access: cacheData,
        };
      }

      const access = await this.accessEnforcer.enforce(input.token, input.tenantId, input.scope);
      await this.cacheStore.set(cacheKey, access, {ttl: 500000});

      return {
        access,
      };
    } catch (e) {
      this.logger.error(e);
      throw new RpcException(e);
    }
  }
}
