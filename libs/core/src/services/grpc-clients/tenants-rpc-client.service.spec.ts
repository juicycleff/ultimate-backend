import { Test, TestingModule } from '@nestjs/testing';
import { TenantsRpcClientService } from './tenants-rpc-client.service';

describe('TenantsRpcClientService', () => {
  let service: TenantsRpcClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantsRpcClientService],
    }).compile();

    service = module.get<TenantsRpcClientService>(TenantsRpcClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
