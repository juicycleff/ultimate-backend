import { CACHE_MANAGER, CacheStore, Inject, Logger } from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { Access, FindAccessResponse, ReadAccessResponse } from '@ultimatebackend/proto-schema/access';
import { NestCasbinService } from 'nestjs-casbin';
import { RpcException } from '@nestjs/microservices';
import { FindAccessQuery } from '../../impl';
import { AccessTokenRepository } from '@ultimatebackend/repository';

@QueryHandler(FindAccessQuery)
export class FindAccessHandler implements IQueryHandler<FindAccessQuery> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly accessEnforcer: NestCasbinService,
    private readonly tokenRepository: AccessTokenRepository,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async execute(query: FindAccessQuery): Promise<FindAccessResponse> {
    this.logger.log(`Async ${query.constructor.name}`); // write here
    const { input } = query;

    try {

      if (!input.tenantId) {
        throw new RpcException('Tenant required');
      }

      const accessToken = await this.tokenRepository.find({ conditions:{ tenantId: input.tenantId} });
      if (!accessToken) {
        throw new RpcException('Accesss token by id not found');
      }

      return {
        accessToken: accessToken as unknown as Access[],
      };
    } catch (e) {
      this.logger.error(e);
      throw new RpcException(e);
    }
  }
}
