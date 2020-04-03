import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenResolver } from './access-token.resolver';

describe('AccessTokenResolver', () => {
  let resolver: AccessTokenResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessTokenResolver],
    }).compile();

    resolver = module.get<AccessTokenResolver>(AccessTokenResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
