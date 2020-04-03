import { Test, TestingModule } from '@nestjs/testing';
import { TenantsResolver } from './tenants.resolver';

describe('TenantsResolver', () => {
  let resolver: TenantsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantsResolver],
    }).compile();

    resolver = module.get<TenantsResolver>(TenantsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
