import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheModule } from '@nestjs/common';
import { PlansResolver } from './plans.resolver';

describe('PlansResolver', () => {
  let resolver: PlansResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        CacheModule.register(),
      ],
      providers: [PlansResolver],
    }).compile();

    resolver = module.get<PlansResolver>(PlansResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
