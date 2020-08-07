import { CACHE_MANAGER, CacheStore, Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PlanRepository } from '@ultimatebackend/repository';
import { FindPlansResponse, Plan } from '@ultimatebackend/proto-schema/billing';
import { RpcException } from '@nestjs/microservices';
import { GetPlansQuery } from '../../impl';

@QueryHandler(GetPlansQuery)
export class GetPlansHandler implements IQueryHandler<GetPlansQuery> {
  logger = new Logger(this.constructor.name);

  public constructor(
    private readonly planRepository: PlanRepository,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async execute(query: GetPlansQuery): Promise<FindPlansResponse> {
    this.logger.log(`Async ${query.constructor.name}...`);

    try {
      const plans = ((await this.planRepository.find()) as unknown) as Plan[];
      return {
        plans,
      };
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
