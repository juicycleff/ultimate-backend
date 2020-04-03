import { Test, TestingModule } from '@nestjs/testing';
import { TenantsMutationResolver } from './tenants-mutation.resolver';

describe('TenantsMutationResolver', () => {
  let resolver: TenantsMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantsMutationResolver],
    }).compile();

    resolver = module.get<TenantsMutationResolver>(TenantsMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
