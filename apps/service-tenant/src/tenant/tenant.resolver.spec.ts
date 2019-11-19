import { Test, TestingModule } from '@nestjs/testing';
import { TenantResolver } from './tenant.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheModule } from '@nestjs/common';

describe('TenantResolver', () => {
  let resolver: TenantResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        CacheModule.register(),
      ],
      providers: [TenantResolver],
    }).compile();

    resolver = module.get<TenantResolver>(TenantResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
