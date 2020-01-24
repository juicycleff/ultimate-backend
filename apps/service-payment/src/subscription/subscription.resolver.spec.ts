import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionResolver } from './subscription.resolver';
import { CoreModule } from '@graphqlcqrs/core';

describe('SubscriptionResolver', () => {
  let resolver: SubscriptionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
      providers: [SubscriptionResolver],
    }).compile();

    resolver = module.get<SubscriptionResolver>(SubscriptionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
