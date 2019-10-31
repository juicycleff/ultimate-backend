import { Test, TestingModule } from '@nestjs/testing';
import { TenantMemberResolver } from './tenant-member.resolver';

describe('TenantMemberResolver', () => {
  let resolver: TenantMemberResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantMemberResolver],
    }).compile();

    resolver = module.get<TenantMemberResolver>(TenantMemberResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
