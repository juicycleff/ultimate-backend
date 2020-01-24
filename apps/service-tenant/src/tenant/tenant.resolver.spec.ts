import { Test, TestingModule } from '@nestjs/testing';
import { TenantResolver } from './tenant.resolver';
import { CoreModule } from '@graphqlcqrs/core';

describe('TenantResolver', () => {
  let resolver: TenantResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CoreModule,
      ],
      providers: [TenantResolver],
    }).compile();

    resolver = module.get<TenantResolver>(TenantResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
