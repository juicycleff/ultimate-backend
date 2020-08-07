import { Logger, CACHE_MANAGER, Inject, CacheStore } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { Plan, ReadPlanResponse } from '@ultimatebackend/proto-schema/billing';
import { PlanRepository } from '@ultimatebackend/repository';
import { GetPlanQuery } from '../../impl';

@QueryHandler(GetPlanQuery)
export class GetPlanHandler implements IQueryHandler<GetPlanQuery> {
  logger = new Logger(this.constructor.name);

  public constructor(
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
    private readonly planRepository: PlanRepository,
  ) {}

  async execute(query: GetPlanQuery): Promise<ReadPlanResponse> {
    this.logger.log(`Async ${query.constructor.name}...`);
    const { input } = query;

    if (!input.id) {
      throw new RpcException('Missing plan id input');
    }

    try {
      const plan = await this.planRepository.findOne({ id: input.id }, true);
      return {
        plan: (plan as unknown) as Plan,
      };
    } catch (e) {
      this.logger.error(e);
      throw new RpcException(e);
    }
  }
}
