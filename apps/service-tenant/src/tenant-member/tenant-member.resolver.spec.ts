import { Test, TestingModule } from '@nestjs/testing';
import { TenantMemberResolver } from './tenant-member.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheModule } from '@nestjs/common';

describe('TenantMemberResolver', () => {
  let resolver: TenantMemberResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        CacheModule.register(),
      ],
      providers: [TenantMemberResolver],
    }).compile();

    resolver = module.get<TenantMemberResolver>(TenantMemberResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
