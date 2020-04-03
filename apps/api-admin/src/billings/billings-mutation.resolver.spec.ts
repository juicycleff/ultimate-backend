import { Test, TestingModule } from '@nestjs/testing';
import { BillingsMutationResolver } from './billings-mutation.resolver';

describe('BillingsMutationResolver', () => {
  let resolver: BillingsMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillingsMutationResolver],
    }).compile();

    resolver = module.get<BillingsMutationResolver>(BillingsMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
