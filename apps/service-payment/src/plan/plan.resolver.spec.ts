import { Test, TestingModule } from '@nestjs/testing';
import { PlanResolver } from './plan.resolver';
import { CqrsModule } from '@nestjs/cqrs';

describe('PlanResolver', () => {
  let resolver: PlanResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [PlanResolver],
    }).compile();

    resolver = module.get<PlanResolver>(PlanResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
