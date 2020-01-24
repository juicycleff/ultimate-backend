import { Test, TestingModule } from '@nestjs/testing';
import { PlanResolver } from './plan.resolver';
import { CoreModule } from '@graphqlcqrs/core';

describe('PlanResolver', () => {
  let resolver: PlanResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
      providers: [PlanResolver],
    }).compile();

    resolver = module.get<PlanResolver>(PlanResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
