import { Test, TestingModule } from '@nestjs/testing';
import { TenantMembersResolver } from './tenant-members.resolver';

describe('TenantMembersResolver', () => {
  let resolver: TenantMembersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantMembersResolver],
    }).compile();

    resolver = module.get<TenantMembersResolver>(TenantMembersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
