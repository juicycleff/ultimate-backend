import { Test, TestingModule } from '@nestjs/testing';
import { AuthPayloadResolver } from './auth-payload.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheModule } from '@nestjs/common';

describe('AuthPayloadResolver', () => {
  let resolver: AuthPayloadResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        CacheModule.register(),
      ],
      providers: [AuthPayloadResolver],
    }).compile();

    resolver = module.get<AuthPayloadResolver>(AuthPayloadResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
