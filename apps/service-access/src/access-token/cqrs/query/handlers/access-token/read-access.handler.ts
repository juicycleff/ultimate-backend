import { CACHE_MANAGER, CacheStore, Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReadAccessResponse } from '@ultimatebackend/proto-schema/access';
import { NestCasbinService } from 'nestjs-casbin';
import { RpcException } from '@nestjs/microservices';
import { ReadAccessQuery } from '../../impl';
import { AccessTokenRepository } from '@ultimatebackend/repository';
import { mapAccessTokenEntityToProto } from '../../../../utitlity';

@QueryHandler(ReadAccessQuery)
export class ReadAccessHandler implements IQueryHandler<ReadAccessQuery> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly accessEnforcer: NestCasbinService,
    private readonly tokenRepository: AccessTokenRepository,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async execute(query: ReadAccessQuery): Promise<ReadAccessResponse> {
    this.logger.log(`Async ${query.constructor.name}`); // write here
    const { input } = query;

    try {
      if (!input.id) {
        throw new RpcException('Accesss token id required');
      }

      if (!input.tenantId) {
        throw new RpcException('Tenant required');
      }

      const accessToken = await this.tokenRepository.findOne({
        _id: input.id,
        tenantId: input.tenantId,
      });
      if (!accessToken) {
        throw new RpcException('Accesss token by id not found');
      }

      return {
        accessToken: mapAccessTokenEntityToProto(accessToken),
      };
    } catch (e) {
      this.logger.error(e);
      throw new RpcException(e);
    }
  }
}
