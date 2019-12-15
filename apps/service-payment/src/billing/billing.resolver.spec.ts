import { Test, TestingModule } from '@nestjs/testing';
import { BillingResolver } from './billing.resolver';
import { CqrsModule } from '@nestjs/cqrs';

describe('BillingResolver', () => {
  let resolver: BillingResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [BillingResolver],
    }).compile();

    resolver = module.get<BillingResolver>(BillingResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
