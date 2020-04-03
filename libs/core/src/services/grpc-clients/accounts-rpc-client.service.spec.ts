import { Test, TestingModule } from '@nestjs/testing';
import { AccountsRpcClientService } from './accounts-rpc-client.service';

describe('AccountsRpcClientService', () => {
  let service: AccountsRpcClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsRpcClientService],
    }).compile();

    service = module.get<AccountsRpcClientService>(AccountsRpcClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
