import { CACHE_MANAGER, CacheStore, Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAccessResponse } from '@ultimatebackend/proto-schema/access';
import { NestCasbinService } from 'nestjs-casbin';
import { RpcException } from '@nestjs/microservices';
import { FindAccessQuery } from '../../impl';
import { AccessTokenRepository } from '@ultimatebackend/repository';
import { mapAccessEntityArrToProto } from '../../../../utitlity';

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

      let filter = {};
      if (input.filter) {
        filter = JSON.parse(input.filter);
      }

      const accessTokens = await this.tokenRepository.find({
        conditions: { ...filter, tenantId: input.tenantId },
      });

      return {
        accessToken: mapAccessEntityArrToProto(accessTokens),
      };
    } catch (e) {
      this.logger.error(e);
      throw new RpcException(e);
    }
  }
}
