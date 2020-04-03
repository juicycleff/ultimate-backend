import { Test, TestingModule } from '@nestjs/testing';
import { BillingsRpcClientService } from './billings-rpc-client.service';

describe('BillingsRpcClientService', () => {
  let service: BillingsRpcClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillingsRpcClientService],
    }).compile();

    service = module.get<BillingsRpcClientService>(BillingsRpcClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
