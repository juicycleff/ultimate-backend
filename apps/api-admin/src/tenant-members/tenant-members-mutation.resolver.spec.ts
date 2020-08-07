import { Test, TestingModule } from '@nestjs/testing';
import { TenantMembersMutationResolver } from './tenant-members-mutation.resolver';

describe('TenantMembersMutationResolver', () => {
  let resolver: TenantMembersMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantMembersMutationResolver],
    }).compile();

    resolver = module.get<TenantMembersMutationResolver>(
      TenantMembersMutationResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
