import { Test, TestingModule } from '@nestjs/testing';
import { TenantResolver } from './tenant.resolver';

describe('TenantResolver', () => {
  let resolver: TenantResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantResolver],
    }).compile();

    resolver = module.get<TenantResolver>(TenantResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
