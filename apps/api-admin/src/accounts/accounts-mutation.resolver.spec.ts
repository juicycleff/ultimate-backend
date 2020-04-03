import { Test, TestingModule } from '@nestjs/testing';
import { AccountsMutationResolver } from './accounts-mutation.resolver';

describe('AccountsMutationResolver', () => {
  let resolver: AccountsMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsMutationResolver],
    }).compile();

    resolver = module.get<AccountsMutationResolver>(AccountsMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
