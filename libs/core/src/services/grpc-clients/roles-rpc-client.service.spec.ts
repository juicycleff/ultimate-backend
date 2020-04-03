import { Test, TestingModule } from '@nestjs/testing';
import { RolesRpcClientService } from './roles-rpc-client.service';

describe('RolesRpcClientService', () => {
  let service: RolesRpcClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesRpcClientService],
    }).compile();

    service = module.get<RolesRpcClientService>(RolesRpcClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
