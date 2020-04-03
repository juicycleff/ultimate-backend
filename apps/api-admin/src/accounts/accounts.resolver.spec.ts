import { Test, TestingModule } from '@nestjs/testing';
import { AccountsResolver } from './accounts.resolver';

describe('AccountsResolver', () => {
  let resolver: AccountsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsResolver],
    }).compile();

    resolver = module.get<AccountsResolver>(AccountsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
