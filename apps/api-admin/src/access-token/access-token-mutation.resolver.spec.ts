import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenMutationResolver } from './access-token-mutation.resolver';

describe('AccessTokenMutationResolver', () => {
  let resolver: AccessTokenMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessTokenMutationResolver],
    }).compile();

    resolver = module.get<AccessTokenMutationResolver>(
      AccessTokenMutationResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
