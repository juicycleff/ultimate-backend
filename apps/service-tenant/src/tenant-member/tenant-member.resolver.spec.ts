import { Test, TestingModule } from '@nestjs/testing';
import { TenantMemberResolver } from './tenant-member.resolver';
import { CacheModule } from '@nestjs/common';
import { CoreModule } from '@graphqlcqrs/core';

describe('TenantMemberResolver', () => {
  let resolver: TenantMemberResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CoreModule,
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
